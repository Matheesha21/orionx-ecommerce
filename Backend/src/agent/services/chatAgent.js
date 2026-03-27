import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { getModel } from "../config/models.js";
import { loadHistory, saveExchange } from "../memory/memoryStore.js";

const SYSTEM_PROMPT = `You are OrionX, a helpful e-commerce shopping assistant.
You help customers find products, answer questions about items,
and provide a friendly shopping experience.
Keep your responses concise and helpful.`;

export const streamChat = async (
  userMessage,
  { userId, mode = "faster", onToken, onProgress } = {}
) => {
  onProgress?.("👋 Getting things ready...");

  const model = getModel(mode, true);

  const rawHistory = loadHistory(userId) || [];

  const history = rawHistory.filter(
    (msg) => msg instanceof HumanMessage || msg instanceof AIMessage
  );

  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    ...history,
    new HumanMessage(userMessage),
  ];

  onProgress?.("💬 Understanding your request...");

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

  await saveExchange(userId, userMessage, aiText);

  onProgress?.("done");
};