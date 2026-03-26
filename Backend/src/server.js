import "dotenv/config"; // Replaces require("dotenv").config()
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js"; // Added .js extension

// Route Imports - All local imports MUST have .js
import userRoutes from "./routes/UserRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import infoRoutes from "./routes/infoRoutes.js"; 
import chatbotRoutes from "./routes/chatbotRoutes.js";
import syncRoutes from "./agent/routes/syncRoutes.js";
import chatRoutes from "./agent/routes/chatRoutes.js";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Increased limits for Cloudinary image strings
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/info", infoRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/agent/sync", syncRoutes);
app.use("/api/agent/chat", chatRoutes);

// Initialize Database
connectDB();

app.get("/", (req, res) => {
  res.send("ORIONX API is officially running!");
});

// Health Check
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus
  });
});

const PORT = process.env.PORT || 5050;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 ORIONX Server live at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();