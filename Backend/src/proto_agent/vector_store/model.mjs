import { GEMINI_API_KEY } from "../../config/proto_agent.mjs";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const embedding_model = genAI.getGenerativeModel({
  model: "gemini-embedding-001"
});