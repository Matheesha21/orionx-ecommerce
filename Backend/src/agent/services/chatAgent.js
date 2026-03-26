import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/models.js";
import { loadHistory, saveExchange } from "../memory/memoryStore.js";

const SYSTEM_PROMPT = `You are OrionX, a helpful e-commerce shopping assistant.
You help customers find products, answer questions about items,
and provide a friendly shopping experience.
Keep your responses concise and helpful.`;

/**
 * Streams a chat response token-by-token via callbacks.
 * Uses in-memory conversation summary buffer to maintain short-term context per user.
 *
 * @param {string} userMessage  - The user's input message
 * @param {object} options
 * @param {string} options.userId - The authenticated user's ID
 * @param {"faster"|"smarter"} options.mode - Model mode (default "faster")
 * @param {(token: string) => void} options.onToken   - Called for every text chunk
 * @param {(status: string) => void} options.onProgress - Called for progress updates
 */
export const streamChat = async (
  userMessage,
  { userId, mode = "faster", onToken, onProgress } = {}
) => {
  onProgress?.("👋 Getting things ready...");

  const model = getModel(mode, true);

  // Load conversation history (summary + recent exchanges)
  const history = loadHistory(userId);

  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    ...history,
    new HumanMessage(userMessage),
  ];

  onProgress?.("💬 Understanding your request...");

  // Inject streaming callback
  model.callbacks = [
    {
      handleLLMNewToken(token) {
        onToken?.(token);
      },
    },
  ];

  onProgress?.("✍️ Preparing a response...");

  const response = await model.invoke(messages);

  const aiText = typeof response.content === "string" ? response.content : "";

  // Save exchange to memory (may trigger summarization of older messages)
  await saveExchange(userId, userMessage, aiText);

  onProgress?.("done");
};
