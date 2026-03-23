require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// Route Imports
const userRoutes = require("./routes/UserRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const orderRoutes = require("./routes/orderRoutes");
const infoRoutes = require("./routes/infoRoutes"); 
const chatbotRoutes = require("./routes/chatbotRoutes");// New route for Chatbot/Business info

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
app.use("/api/chatbot", chatbotRoutes); // Endpoint for unstructured chatbot data

// Initialize Database
connectDB();

app.get("/", (req, res) => {
  res.send("ORIONX API is officially running!");
});

// Health Check - useful for your M4 MacBook dev environment
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus
  });
});

// Port 5050 to avoid macOS AirPlay Receiver conflicts
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