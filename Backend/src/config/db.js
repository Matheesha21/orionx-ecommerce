import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri || typeof uri !== "string" || uri.trim() === "") {
      console.error(
        "❌ MONGO_URI is not defined. Make sure you have a .env file in the Backend folder with MONGO_URI set, or export the variable in your environment. You can copy .env.example -> .env and fill in the details."
      );
      // Exit early to avoid passing `undefined` to mongoose.connect
      process.exit(1);
    }

    // Pass URI explicitly. With modern mongoose (v6+) and mongodb driver v4+ these
    // options are not needed and can cause errors, so call connect without them.
    await mongoose.connect(uri);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;