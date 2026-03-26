import pool from "../config/pgClient.js";

export const initProductsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query("CREATE EXTENSION IF NOT EXISTS vector;");

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        _id             TEXT PRIMARY KEY,
        name            TEXT NOT NULL,
        category        TEXT,
        subcategory     TEXT,
        brand           TEXT,
        price           NUMERIC,
        description     TEXT,
        "shortDescription" TEXT,
        "discountPercentage" NUMERIC,
        __v             INTEGER DEFAULT 0,
        embedding       vector(768)
      );
    `);

    console.log("PostgreSQL products table ready.");
  } finally {
    client.release();
  }
};
