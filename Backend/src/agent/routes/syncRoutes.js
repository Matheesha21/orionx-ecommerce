import express from "express";
import { protect, adminOnly } from "../../middleware/authMiddleware.js";
import { syncProducts } from "../services/syncProducts.js";
import { syncDocuments } from "../services/syncDocuments.js";

const router = express.Router();

// POST /api/agent/sync/products
// Admin-only: syncs MongoDB products collection into PostgreSQL vector DB
router.post("/products", protect, adminOnly, async (req, res) => {
  try {
    console.log("Product sync started...");
    const summary = await syncProducts();
    console.log("Product sync complete:", summary);
    res.json({ message: "Sync complete", summary });
  } catch (err) {
    console.error("Product sync failed:", err);
    res.status(500).json({ message: "Sync failed", error: err.message });
  }
});

// POST /api/agent/sync/documents
// Admin-only: syncs MongoDB documents collection into PostgreSQL vector DB
router.post("/documents", protect, adminOnly, async (req, res) => {
  try {
    console.log("Document sync started...");
    const summary = await syncDocuments();
    console.log("Document sync complete:", summary);
    res.json({ message: "Sync complete", summary });
  } catch (err) {
    console.error("Document sync failed:", err);
    res.status(500).json({ message: "Sync failed", error: err.message });
  }
});

export default router;
