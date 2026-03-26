import { model } from "./client.js";
import { buildPrompt } from "./memory_handlers.js";
import { extractJSON } from "./utils/json_parser.js";
import { tools } from "./tools/index.js";
import { initializeVectorStore } from "./vector_store/embedding_pipelines.js";

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
      console.log("Parsed Tool Call:", parsed.tool, parsed.args);

      if (!tool) {
        console.error("Unknown tool:", parsed.tool);
        return "Sorry, something went wrong.";
      }

      try {
        await initializeVectorStore();
        const toolResult = await tool.func(parsed.args);
        console.log("Tool Result:", toolResult);

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

// const run_test = async () => {
//   const response = await run_agent("Can you find me a laptop under $1000 with good reviews?");
//   console.log("Final Response:", response);
// }

// run_test();
