import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const MODEL_MAP = {
  faster: "gemini-2.5-flash-lite",
  smarter: "gemini-2.5-flash",
};

/**
 * Returns a ChatGoogleGenerativeAI instance based on the requested mode.
 * @param {"faster" | "smarter"} mode - Model selection mode
 * @param {boolean} streaming - Whether to enable streaming (default: true)
 */
export const getModel = (mode = "faster", streaming = true) => {
  const modelName = MODEL_MAP[mode];

  if (!modelName) {
    throw new Error(
      `Invalid model mode "${mode}". Use "faster" or "smarter".`
    );
  }

  return new ChatGoogleGenerativeAI({
    model: modelName,
    apiKey: process.env.GEMINI_API_KEY,
    streaming,
  });
};
