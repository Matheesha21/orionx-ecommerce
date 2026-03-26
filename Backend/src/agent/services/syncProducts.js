import Product from "../../models/Product.js";
import pool from "../config/pgClient.js";
import { initProductsTable } from "../db/initProductsTable.js";
import { generateProductEmbedding } from "../embeddings/embeddingModel.js";

/**
 * Syncs the MongoDB products collection into the PostgreSQL products table.
 * - Inserts new products.
 * - Updates existing products if MongoDB __v is higher than PostgreSQL __v.
 * - Skips products where __v is equal (no changes).
 *
 * Returns a summary object with counts of inserted, updated, and skipped products.
 */
export const syncProducts = async () => {
  await initProductsTable();

  const mongoProducts = await Product.find({}).lean();

  const summary = { inserted: 0, updated: 0, skipped: 0, failed: 0 };

  for (const product of mongoProducts) {
    const id = product._id.toString();

    try {
      const { rows } = await pool.query(
        'SELECT __v FROM products WHERE _id = $1',
        [id]
      );

      const existsInPg = rows.length > 0;
      const pgVersion = existsInPg ? rows[0].__v : null;
      const mongoVersion = product.__v ?? 0;

      if (existsInPg && pgVersion >= mongoVersion) {
        summary.skipped++;
        continue;
      }

      const embedding = await generateProductEmbedding(product);
      const embeddingLiteral = `[${embedding.join(",")}]`;

      if (!existsInPg) {
        await pool.query(
          `INSERT INTO products (
            _id, name, category, subcategory, brand, price,
            description, "shortDescription", "discountPercentage", __v, embedding
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::vector)`,
          [
            id,
            product.name,
            product.category,
            product.subcategory ?? null,
            product.brand,
            product.price,
            product.description,
            product.shortDescription,
            product.discountPercentage ?? null,
            mongoVersion,
            embeddingLiteral,
          ]
        );
        summary.inserted++;
      } else {
        await pool.query(
          `UPDATE products SET
            name = $2,
            category = $3,
            subcategory = $4,
            brand = $5,
            price = $6,
            description = $7,
            "shortDescription" = $8,
            "discountPercentage" = $9,
            __v = $10,
            embedding = $11::vector
          WHERE _id = $1`,
          [
            id,
            product.name,
            product.category,
            product.subcategory ?? null,
            product.brand,
            product.price,
            product.description,
            product.shortDescription,
            product.discountPercentage ?? null,
            mongoVersion,
            embeddingLiteral,
          ]
        );
        summary.updated++;
      }
    } catch (err) {
      console.error(`Failed to sync product ${id} (${product.name}):`, err.message);
      summary.failed++;
    }
  }

  return summary;
};
