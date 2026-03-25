import express from "express";
const router = express.Router();
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

// Public Routes
router.get("/", getProducts);
router.get("/slug/:slug", getProductBySlug);

// Admin Routes
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;