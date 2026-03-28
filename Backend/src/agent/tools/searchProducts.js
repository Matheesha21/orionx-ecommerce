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
 * LangChain tool: searches the PostgreSQL vector DB for products
 * similar to the user's query, optionally filtered by max price.
 */
export const searchProductsTool = new DynamicStructuredTool({
  name: "search_products",
  description:
    "Search the product catalog for items matching a natural-language query. " +
    "Use this when the user asks about products, recommendations, comparisons, " +
    "or anything that requires looking up items in the store.",
  schema: z.object({
    query: z
      .string()
      .describe("Natural language search query describing what the user is looking for"),
    max_price: z
      .number()
      .optional()
      .describe("Optional maximum price filter. Only include if the user explicitly mentions a price limit"),
  }),
  func: async ({ query, max_price }) => {
    const embedding = await embedQuery(query);
    const embeddingLiteral = `[${embedding.join(",")}]`;

    let sql = `
      SELECT
        _id,
        name,
        category,
        subcategory,
        brand,
        price,
        "shortDescription",
        "discountPercentage",
        1 - (embedding <=> $1::vector) AS similarity
      FROM products
      WHERE 1 - (embedding <=> $1::vector) >= $2
    `;
    const params = [embeddingLiteral, SIMILARITY_THRESHOLD];

    if (max_price !== undefined && max_price !== null) {
      sql += ` AND price <= $3`;
      params.push(max_price);
    }

    sql += ` ORDER BY similarity DESC LIMIT $${params.length + 1}`;
    params.push(MAX_RESULTS);

    const { rows } = await pool.query(sql, params);

    if (rows.length === 0) {
      return "No products found matching that query.";
    }

    const results = rows.map((r) => ({
      id: r._id,
      name: r.name,
      category: r.category,
      subcategory: r.subcategory,
      brand: r.brand,
      price: Number(r.price),
      shortDescription: r.shortDescription,
      discountPercentage: r.discountPercentage ? Number(r.discountPercentage) : null,
      similarity: Number(r.similarity).toFixed(3),
    }));

    return JSON.stringify(results, null, 2);
  },
});

export const tools = [searchProductsTool];
