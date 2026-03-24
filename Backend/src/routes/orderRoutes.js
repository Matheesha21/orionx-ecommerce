import express from "express";
const router = express.Router();
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered
} from "../controllers/orderController.js";

// Customer Routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Admin Routes
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/pay", protect, adminOnly, updateOrderToPaid);
router.put("/:id/deliver", protect, adminOnly, updateOrderToDelivered);

export default router;