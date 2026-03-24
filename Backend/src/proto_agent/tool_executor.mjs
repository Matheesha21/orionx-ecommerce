import { searchProductsTool } from "./tools/product/search_product.mjs";
import { initializeVectorStore } from "./vector_store/embedding_pipelines.mjs";

export const executeTool = async (tool, args) => {
  try {
    const result = await tool.func(args);
    return result;
  } catch (error) {
    console.error(`Error executing tool ${tool.name}:`, error);
    throw error;
  }
}
