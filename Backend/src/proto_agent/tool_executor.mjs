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

// const test = () => {
//   initializeVectorStore().then(async () => {
//     console.log("Vector store initialized, executing tool...");
//     const result_ = await executeTool(searchProductsTool, { query: "any watches?", maxPrice: 1000 })
//     console.log("tool executor results: ", result_);
//   }
//   ).catch(err => {
//     console.error("Error initializing vector store:", err);
//   });
// }

// test();
