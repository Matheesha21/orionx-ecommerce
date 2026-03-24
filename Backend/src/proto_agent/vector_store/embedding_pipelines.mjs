import { products } from "./data/products.mjs";
import { embedding_model } from "./model.mjs";

export let VECTOR_DATABASE = [];

const initializeVectorStore = async () => {
  for (let product of products) {

    // ✅ Validate product
    if (!product.id || !product.name || !product.category || !product.subcategory || !product.price || !product.stock) {
      console.error("Invalid product data:", product);
      continue;
    }

    // ✅ Convert to text (IMPORTANT)
    const product_data = `
      ${product.name}
      Category: ${product.category}
      Subcategory: ${product.subcategory}
      Price: ${product.price}
      Stock: ${product.stock}
    `;

    try {
      // ✅ Correct Gemini embedding call
      const result = await embedding_model.embedContent({
        content: {
          parts: [{ text: product_data }]
        },
        outputDimensionality: 768
      });

      const embedding = result.embedding.values;

      // ✅ Store properly
      const product_object = {
        id: product.id,
        embedding,
        meta_data: {
          name: product.name,
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          stock: product.stock
        }
      };

      VECTOR_DATABASE.push(product_object);

    } catch (err) {
      console.error("Embedding failed for:", product.name, err);
    }
  }

  console.info("Vector store initialized");
};

initializeVectorStore();