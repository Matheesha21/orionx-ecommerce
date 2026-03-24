import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js"; // Added .js
import {
  registerUser,
  loginUser,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/userController.js"; // Added .js

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Cart
router.post("/cart", protect, addToCart);
router.get("/cart", protect, getCart);
router.put("/cart", protect, updateCartItem);
router.delete("/cart/:productId", protect, removeFromCart);

// Wishlist
router.post("/wishlist", protect, addToWishlist);
router.get("/wishlist", protect, getWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

export default router;