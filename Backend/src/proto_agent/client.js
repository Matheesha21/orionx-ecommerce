import { GEMINI_API_KEY, GEMINI_MODEL } from "../config/proto_agent.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({
  model: GEMINI_MODEL
});