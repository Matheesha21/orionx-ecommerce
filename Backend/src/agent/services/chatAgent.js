import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/models.js";

const SYSTEM_PROMPT = `You are OrionX, a helpful e-commerce shopping assistant.
You help customers find products, answer questions about items,
and provide a friendly shopping experience.
Keep your responses concise and helpful.`;

/**
 * Streams a chat response token-by-token via callbacks.
 *
 * @param {string} userMessage  - The user's input message
 * @param {object} options
 * @param {"faster"|"smarter"} options.mode - Model mode (default "faster")
 * @param {(token: string) => void} options.onToken   - Called for every text chunk
 * @param {(status: string) => void} options.onProgress - Called for progress updates
 */
export const streamChat = async (
  userMessage,
  { mode = "faster", onToken, onProgress } = {}
) => {
  onProgress?.("👋 Getting things ready...");

  const model = getModel(mode, true);

  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(userMessage),
  ];

  onProgress?.("💬 Understanding your request...");

  // ✅ Inject streaming callback
  model.callbacks = [
    {
      handleLLMNewToken(token) {
        onToken?.(token);
      },
    },
  ];

  onProgress?.("✍️ Preparing a response...");

  await model.invoke(messages); 

  onProgress?.("done");
};