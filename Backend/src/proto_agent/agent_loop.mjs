import { model } from "./client.mjs";
import { buildPrompt } from "./memory_handlers.mjs";
import { extractJSON } from "./utils/json_parser.mjs";
import { tools } from "./tools/index.mjs";
import { products } from "./vector_store/data/products.mjs";
import { initializeVectorStore } from "./vector_store/embedding_pipelines.mjs";

const MAX_STEPS = 2;

export const run_agent = async (input) => {
  const memory = [
    { role: "user", content: input }
  ];

  for (let step = 0; step < MAX_STEPS; step++) {

    const prompt = buildPrompt(memory, input);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = extractJSON(text);

    // ✅ TOOL CALL
    if (parsed && parsed.tool && parsed.args) {

      const tool = tools.find(t => t.name === parsed.tool);

      if (!tool) {
        console.error("Unknown tool:", parsed.tool);
        return "Sorry, something went wrong.";
      }

      try {
        await initializeVectorStore();
        const toolResult = await tool.func(parsed.args);

        // Add tool result to memory
        memory.push({
          role: "assistant",
          content: `TOOL_RESULT: ${JSON.stringify(toolResult)}`
        });

        // Continue loop (LLM sees tool result next round)
        continue;

      } catch (err) {
        console.error("Tool execution failed:", err);
        return "Tool execution failed.";
      }
    }

    // ✅ FINAL ANSWER (no tool call)
    memory.push({
      role: "assistant",
      content: text
    });

    return text;
  }

  return "Max steps reached. Please try again.";
};
