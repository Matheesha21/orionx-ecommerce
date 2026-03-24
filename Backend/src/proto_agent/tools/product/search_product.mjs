import { VECTOR_DATABASE } from "../../vector_store/embedding_pipelines.mjs";
import { cosineSimilaritySearch } from "../../utils/similarity.mjs";
import { embedding_model } from "../../vector_store/model.mjs";

export const searchProductsTool = {
  name: "search_products",
  description: `
    Search for products based on user query and optional price filter
    Arguements:
    - query (string, required): General search intent expressed in natural language.
    - maxPrice (number, optional): Maximum price for the product.
  `,
  func: async ({ query, maxPrice }) => {
    // 1. Validate input
    if (!query) {
      throw new Error("Query is required");
    }

    // 2. embed the query 
    const queryEmbedding = await embedding_model.embedContent({
      content: {
        parts: [{ text: query }]
      },
      outputDimensionality: 768
    });

    // 3. Search in-memory vector database using query
    let result = cosineSimilaritySearch(queryEmbedding.embedding.values, VECTOR_DATABASE);

    // 4. Filter results based on maxPrice if provided
      if (maxPrice) {
        result = result.filter(item => item.meta_data.price <= maxPrice);
      }
    // 5. Return search results
    return result.map(item => ({
      id: item.id,
      name: item.meta_data.name,
      description: item.meta_data.description,
      category: item.meta_data.category,
      subcategory: item.meta_data.subcategory,
      price: item.meta_data.price,
      stock: item.meta_data.stock
    }));
  }
}