import Document from "../../models/Document.js";
import pool from "../config/pgClient.js";
import { initDocumentsTable } from "../db/initDocumentsTable.js";
import { generateDocumentEmbedding } from "../embeddings/embeddingModel.js";

/**
 * Syncs the MongoDB documents collection into the PostgreSQL documents table.
 * - Inserts new documents.
 * - Updates existing documents if MongoDB __v is higher than PostgreSQL __v.
 * - Skips documents where __v is equal (no changes).
 *
 * Returns a summary object with counts of inserted, updated, and skipped documents.
 */
export const syncDocuments = async () => {
  await initDocumentsTable();

  const mongoDocs = await Document.find({}).lean();

  const summary = { inserted: 0, updated: 0, skipped: 0, failed: 0 };

  for (const doc of mongoDocs) {
    const id = doc._id.toString();

    try {
      const { rows } = await pool.query(
        "SELECT __v FROM documents WHERE _id = $1",
        [id]
      );

      const existsInPg = rows.length > 0;
      const pgVersion = existsInPg ? rows[0].__v : null;
      const mongoVersion = doc.__v ?? 0;

      if (existsInPg && pgVersion >= mongoVersion) {
        summary.skipped++;
        continue;
      }

      const embedding = await generateDocumentEmbedding(doc);
      const embeddingLiteral = `[${embedding.join(",")}]`;

      if (!existsInPg) {
        await pool.query(
          `INSERT INTO documents (
            _id, title, chunk_index, content, __v, embedding
          ) VALUES ($1,$2,$3,$4,$5,$6::vector)`,
          [
            id,
            doc.title,
            doc.chunk_index,
            doc.content,
            mongoVersion,
            embeddingLiteral,
          ]
        );
        summary.inserted++;
      } else {
        await pool.query(
          `UPDATE documents SET
            title = $2,
            chunk_index = $3,
            content = $4,
            __v = $5,
            embedding = $6::vector
          WHERE _id = $1`,
          [
            id,
            doc.title,
            doc.chunk_index,
            doc.content,
            mongoVersion,
            embeddingLiteral,
          ]
        );
        summary.updated++;
      }
    } catch (err) {
      console.error(`Failed to sync document ${id} (${doc.title}):`, err.message);
      summary.failed++;
    }
  }

  return summary;
};
