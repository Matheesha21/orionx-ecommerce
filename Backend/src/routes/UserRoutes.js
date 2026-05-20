import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js"; // Added .js
import {
  registerUser,
  loginUser,
  googleLogin,
  getProfile,
  updateProfile,
  requestEmailOtp,
  verifyEmailOtp,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/userController.js"; // Added .js

// Public Routes
router.post("/request-otp", requestEmailOtp);
router.post("/verify-otp", verifyEmailOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

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