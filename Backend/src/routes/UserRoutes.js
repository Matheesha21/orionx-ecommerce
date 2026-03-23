const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/userController");

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

module.exports = router;