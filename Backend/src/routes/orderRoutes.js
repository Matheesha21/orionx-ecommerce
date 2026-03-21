const express = require("express");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE ORDER
router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

// GET LOGGED-IN USER ORDERS
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

// GET SINGLE ORDER BY ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin === true;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

// GET ALL ORDERS (ADMIN ONLY)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id username email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

// MARK ORDER AS PAID (ADMIN)
router.put("/:id/pay", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = "Paid";

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

// MARK ORDER AS DELIVERED (ADMIN)
router.put("/:id/deliver", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = "Delivered";

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

module.exports = router;