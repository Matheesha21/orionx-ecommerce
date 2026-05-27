import "dotenv/config"; // Replaces require("dotenv").config()
import express from "express";
import cors from "cors";


// Route Imports - All local imports MUST have .js
import userRoutes from "./routes/UserRoutes.js";

import uploadRoutes from "./routes/uploadRoutes.js";

import infoRoutes from "./routes/infoRoutes.js"; 
import chatbotRoutes from "./routes/chatbotRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import syncRoutes from "./agent/routes/syncRoutes.js";
import chatRoutes from "./agent/routes/chatRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

import contactRoutes from "./routes/contactRoutes.js";

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

app.use("/api/uploads", uploadRoutes);

app.use("/api/info", infoRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/products", productRoutes);
app.use("/api/agent/sync", syncRoutes);
app.use("/api/agent/chat", chatRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.use("/api/contact", contactRoutes);

// Initialize Database


app.get("/", (req, res) => {
  res.send("ORIONX API is officially running!");
});

// Health Check
app.get("/api/health", async (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: "connected"
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