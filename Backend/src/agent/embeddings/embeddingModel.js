import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const embeddingModel = genAI.getGenerativeModel({
  model: "gemini-embedding-001",
});

/**
 * Generates an embedding vector for a product.
 * Combines name, category, subcategory, brand, price, description,
 * shortDescription, and discountPercentage into a single text block.
 */
export const generateProductEmbedding = async (product) => {
  const text = `
    Name: ${product.name}
    Category: ${product.category}
    Subcategory: ${product.subcategory || ""}
    Brand: ${product.brand}
    Price: ${product.price}
    Description: ${product.description}
    Short Description: ${product.shortDescription}
    Discount: ${product.discountPercentage ?? 0}%
  `.trim();

  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }] },
    outputDimensionality: 768,
  });

  return result.embedding.values;
};
