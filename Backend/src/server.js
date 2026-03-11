require("dotenv").config();
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const UserRoutes = require("./routes/userRoutes");
const ProductRoutes = require("./routes/productRoutes");
const protect = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", ProductRoutes);
app.use("/api/users", UserRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("ORIONX API is officially running!");
});

app.get("/api/test", protect, (req, res) => {
  res.json({ message: "Protected route works!" });
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