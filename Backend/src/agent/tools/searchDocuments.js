import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import pool from "../config/pgClient.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

const SIMILARITY_THRESHOLD = 0.5;
const MAX_RESULTS = 3;

/**
 * Embeds a search query into a 768-dimensional vector.
 */
const embedQuery = async (query) => {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text: query }] },
    outputDimensionality: 768,
  });
  return result.embedding.values;
};

/**
 * LangChain tool: searches the PostgreSQL vector DB for document chunks
 * most similar to the user's query.
 */
export const searchDocumentsTool = new DynamicStructuredTool({
  name: "get_document_contents",
  description:
    "Search internal documents (policies, FAQs, guides, terms & conditions, etc.) " +
    "for information matching a natural-language query. Use this when the user asks " +
    "about store policies, privacy, shipping, returns, refunds, terms of service, " +
    "or any company-related information that is NOT a product lookup.",
  schema: z.object({
    query: z
      .string()
      .describe("Natural language query describing what information the user is looking for"),
  }),
  func: async ({ query }) => {
    const embedding = await embedQuery(query);
    const embeddingLiteral = `[${embedding.join(",")}]`;

    const sql = `
      SELECT
        _id,
        title,
        chunk_index,
        content,
        1 - (embedding <=> $1::vector) AS similarity
      FROM documents
      WHERE 1 - (embedding <=> $1::vector) >= $2
      ORDER BY similarity DESC
      LIMIT $3
    `;

    const { rows } = await pool.query(sql, [
      embeddingLiteral,
      SIMILARITY_THRESHOLD,
      MAX_RESULTS,
    ]);

    if (rows.length === 0) {
      return "No relevant documents found matching that query.";
    }

    const results = rows.map((r) => ({
      title: r.title,
      chunkIndex: r.chunk_index,
      content: r.content,
      similarity: Number(r.similarity).toFixed(3),
    }));

    return JSON.stringify(results, null, 2);
  },
});
