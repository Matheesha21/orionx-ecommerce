import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Note: process.env.MONGO_URI is still accessed the same way
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;