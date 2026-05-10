import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri || typeof uri !== "string" || uri.trim() === "") {
      console.error(
        "❌ MONGO_URI is not defined. Make sure you have a .env file in the Backend folder with MONGO_URI set, or export the variable in your environment. You can copy .env.example -> .env and fill in the details."
      );
      // In development, don't kill the whole process. Return early and let the
      // server start so other features (routes, health checks) can be used.
      return;
    }

    // Detect common placeholder values so we don't attempt a network DNS
    // lookup for obviously fake strings. This avoids noisy ENOTFOUND errors
    // when a developer copied `.env.example` into `.env` without editing it.
    const placeholderPatterns = [
      /example/i,
      /<.*>/, // contains angle brackets like <username>
      /your_db_name/i,
      /your_username/i,
      /your_password/i,
      /cluster0\.example/,
    ];

    const looksLikePlaceholder = placeholderPatterns.some((re) => re.test(uri));
    if (looksLikePlaceholder) {
      console.warn(
        "⚠️  MONGO_URI looks like a placeholder value. Skipping connection attempt. Please update Backend/.env with a real MongoDB URI."
      );
      return;
    }

    try {
      // Pass URI explicitly. With modern mongoose (v6+) and mongodb driver v4+
      // these options are not needed and can cause errors, so call connect
      // without them.
      await mongoose.connect(uri);
      console.log("✅ MongoDB connected successfully");
    } catch (connectError) {
      // Log a helpful message but don't exit the process in development.
      console.error("❌ Database connection failed:", connectError);
      console.error(
        "⚠️  Continuing without a DB connection. Some features will be unavailable until MONGO_URI is fixed."
      );
      return;
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;