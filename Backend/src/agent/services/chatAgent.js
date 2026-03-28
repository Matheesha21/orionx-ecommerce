import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/models.js";
import { loadHistory, saveExchange } from "../memory/memoryStore.js";
import { tools } from "../tools/searchProducts.js";

const MAX_TOOL_ROUNDS = 3;

const SYSTEM_PROMPT = `You are OrionX, a helpful e-commerce shopping assistant.
You help customers find products, answer questions about items, and provide a friendly shopping experience.
Keep your responses concise and helpful.

## Tool Usage
You have access to the following tools:
- **search_products**: Search the product catalog by natural language query, with an optional max_price filter.

Guidelines for using tools:
- Use search_products whenever the user asks about products, wants recommendations, comparisons, or anything requiring catalog data.
- You can call multiple tools in a single turn if needed (up to 3).
- If the first search doesn't give you enough information, you may search again with a refined query.
- Do NOT search if the user is making casual conversation or asking something unrelated to products.
- When presenting product results, format them nicely with name, brand, price, and a brief description.
- If products have a discount, mention it.
- If no products are found, let the user know and suggest broadening their search.`;

/**
 * Looks up a tool by name and executes it with the given arguments.
 */
const executeTool = async (toolCall) => {
  const tool = tools.find((t) => t.name === toolCall.name);
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
  { userId, mode = "faster", onToken, onProgress } = {}
) => {
  onProgress?.("Getting things ready...");

  const model = getModel(mode, true);
  const modelWithTools = model.bindTools(tools);

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
    onProgress?.(`Searching for products... (round ${round})`);

    // Execute all tool calls in parallel
    const toolResults = await Promise.all(toolCalls.map(executeTool));

    // Append tool results to the message chain
    for (const result of toolResults) {
      messages.push(result);
    }
  }

  // Final streaming pass for the text response
  onProgress?.("Preparing a response...");

  // Check if the last message is already an AI text response (from the loop break)
  const lastMsg = messages[messages.length - 1];
  const alreadyHasAnswer =
    lastMsg._getType?.() === "ai" &&
    typeof lastMsg.content === "string" &&
    lastMsg.content.length > 0 &&
    (!lastMsg.tool_calls || lastMsg.tool_calls.length === 0);

  let aiText = "";

  if (alreadyHasAnswer) {
    // The non-streaming invoke already produced the answer.
    // Re-emit it token-by-token for the SSE stream.
    aiText = lastMsg.content;
    onToken?.(aiText);
  } else {
    // Stream a fresh response (after tool results, or if last round hit the limit)
    const streamModel = getModel(mode, true);
    streamModel.callbacks = [
      {
        handleLLMNewToken(token) {
          onToken?.(token);
        },
      },
    ];

    const finalResponse = await streamModel.invoke(messages);
    aiText =
      typeof finalResponse.content === "string" ? finalResponse.content : "";
  }

  // Save the exchange to memory
  await saveExchange(userId, userMessage, aiText);

  onProgress?.("done");
};
