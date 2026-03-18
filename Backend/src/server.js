require("dotenv").config();
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const UserRoutes = require("./routes/userRoutes");
const ProductRoutes = require("./routes/productRoutes");
const { protect } = require("./middleware/authMiddleware");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/products", ProductRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/uploads", uploadRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("ORIONX API is officially running!");
});

app.get("/api/test", protect, (req, res) => {
  res.json({ message: "Protected route works!" });
});

app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus
  });
});

// We use 5050 to avoid Mac AirPlay conflicts
const PORT = process.env.PORT || 5050;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server is live at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();