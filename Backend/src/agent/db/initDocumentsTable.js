import pool from "../config/pgClient.js";

export const initDocumentsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query("CREATE EXTENSION IF NOT EXISTS vector;");

    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        _id             TEXT PRIMARY KEY,
        title           TEXT NOT NULL,
        chunk_index     INTEGER NOT NULL,
        content         TEXT,
        __v             INTEGER DEFAULT 0,
        embedding       vector(768)
      );
    `);

    console.log("PostgreSQL documents table ready.");
  } finally {
    client.release();
  }
};
