const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in your .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection error ❌:", error.message);
    console.error("Server will continue but DB calls will fail until fixed.");
    // Removed process.exit(1) — server no longer crashes on bad URI
  }
};

module.exports = connectDB;