import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/models.js";
import { loadHistory, saveExchange } from "../memory/memoryStore.js";
import { tools as staticTools } from "../tools/searchProducts.js";
import { createCartTools } from "../tools/cartTools.js";

const MAX_TOOL_ROUNDS = 5;

const SYSTEM_PROMPT = `You are OrionX, a helpful e-commerce shopping assistant.
You help customers find products, answer questions about items, manage their cart, and provide a friendly shopping experience.
Keep your responses concise and helpful.

## Tool Usage
You have access to the following tools:

### Product & Information Search
- **search_products**: Search the product catalog by natural language query, with an optional max_price filter.
- **get_product_by_id**: Look up a single product by its exact productId. Use when you already have a productId (e.g. from the cart) and need full details.
- **get_document_contents**: Search internal documents (policies, FAQs, guides, terms & conditions, shipping info, etc.) for company-related information.

### Cart Management
- **get_cart**: View the user's current shopping cart.
- **add_to_cart**: Add a product to the cart. Requires a productId — always search for the product first to get the correct ID before adding.
- **remove_from_cart**: Remove an item entirely from the cart.

## Guidelines
- Use search_products whenever the user asks about products, wants recommendations, comparisons, or anything requiring catalog data.
- Use get_document_contents for store policies, privacy, shipping, returns, refunds, terms of service, or company info.
- You can call multiple tools in a single turn if needed (up to 3). For example, if the user asks about a product AND the return policy, call both at once.
- If the first search doesn't give enough information, refine your query and search again.
- Do NOT use tools for casual conversation or clearly unrelated questions.

### Cart-Specific Guidelines
- When the user asks to add a product by name, FIRST use search_products to find the exact product and its ID, THEN use add_to_cart with that ID.
- When removing or updating, if you don't know the productId, use get_cart first to look it up.
- Always confirm cart changes to the user by summarizing what was added/removed/updated.
- When presenting cart contents, show product names, quantities, prices, and the total.

### Presentation
- Format product results nicely with name, brand, price, and a brief description.
- If products have a discount, mention it.
- When answering from documents, provide clear answers based on document content. Do not fabricate policy details.
- If no results are found, let the user know and suggest broadening their search.`;

/**
 * Human-friendly progress messages for each tool.
 * DynamicStructuredTool discards custom fields, so we store them separately.
 */
const TOOL_MESSAGES = {
  search_products: "Searching for products...",
  get_product_by_id: "Looking up product details...",
  get_document_contents: "Looking through documents...",
  get_cart: "Looking at your cart...",
  add_to_cart: "Adding product to your cart...",
  remove_from_cart: "Removing product from your cart...",
};

/**
 * Looks up a tool by name and executes it with the given arguments.
 */
const executeTool = async (toolCall, allTools) => {
  const tool = allTools.find((t) => t.name === toolCall.name);
  if (!tool) {
    return new ToolMessage({
      toolCallId: toolCall.id,
      name: toolCall.name,
      content: `Error: unknown tool "${toolCall.name}"`,
    });
  }

  try {
    const result = await tool.invoke(toolCall.args);
    return new ToolMessage({
      toolCallId: toolCall.id,
      name: toolCall.name,
      content: typeof result === "string" ? result : JSON.stringify(result),
    });
  } catch (err) {
    console.error(
      `[executeTool] ${toolCall.name} failed:`,
      err.message,
      err.stack,
    );
    return new ToolMessage({
      toolCallId: toolCall.id,
      name: toolCall.name,
      content: `Error executing ${toolCall.name}: ${err.message}`,
    });
  }
};

/**
 * Streams a chat response with tool-calling support.
 *
 * Flow:
 *  1. Send messages to model (with tools bound).
 *  2. If the model returns tool_calls → execute them, append results, loop (max 3 rounds).
 *  3. When the model returns a text response (no tool calls), stream it token-by-token.
 */
export const streamChat = async (
  userMessage,
  { userId, mode = "faster", onToken, onProgress } = {},
) => {
  onProgress?.("Getting things ready...");

  const model = getModel(mode, true);

  // Build per-request tools array: static tools + user-bound cart tools
  const cartTools = createCartTools(userId);
  const allTools = [...staticTools, ...cartTools];

  const modelWithTools = model.bindTools(allTools);

  // Build message array: system + history + new user message
  const history = loadHistory(userId);
  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    ...history,
    new HumanMessage(userMessage),
  ];

  onProgress?.("Understanding your request...");

  let round = 0;

  while (round < MAX_TOOL_ROUNDS) {
    // Non-streaming invoke to check for tool calls
    const response = await modelWithTools.invoke(messages);
    messages.push(response);

    const toolCalls = response.tool_calls;

    // No tool calls → model wants to give a text answer
    if (!toolCalls || toolCalls.length === 0) {
      break;
    }

    round++;
    const toolNames = toolCalls.map((tc) => tc.name).join(", ");

    // Send progress messages for each tool being called
    for (const tc of toolCalls) {
      const msg = TOOL_MESSAGES[tc.name];
      if (msg) {
        onProgress?.(msg);
      }
    }

    // Execute all tool calls in parallel
    const toolResults = await Promise.all(
      toolCalls.map((tc) => executeTool(tc, allTools)),
    );

    // Append tool results to the message chain
    for (const result of toolResults) {
      messages.push(result);
    }
  }

  // Final streaming pass — always stream the answer
  onProgress?.("Preparing a response...");

  // If the loop broke because the model gave a text answer (no tool calls),
  // that non-streamed response is already in messages. Remove it so we can
  // re-generate it as a stream.
  const lastMsg = messages[messages.length - 1];
  const lastIsTextAnswer =
    lastMsg._getType?.() === "ai" &&
    typeof lastMsg.content === "string" &&
    lastMsg.content.length > 0 &&
    (!lastMsg.tool_calls || lastMsg.tool_calls.length === 0);

  if (lastIsTextAnswer) {
    messages.pop();
  }

  const streamModel = getModel(mode, true);
  streamModel.callbacks = [
    {
      handleLLMNewToken(token) {
        onToken?.(token);
      },
    },
  ];

  const finalResponse = await streamModel.invoke(messages);
  const aiText =
    typeof finalResponse.content === "string" ? finalResponse.content : "";

  // Save the exchange to memory
  await saveExchange(userId, userMessage, aiText);

  onProgress?.("done");
};
