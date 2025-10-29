const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/transetu_exercises";
    
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    if (process.env.NODE_ENV === 'production') {
      // MongoDB Atlas URLs already include SSL by default
      // Just ensure the connection string has ssl=true if needed
      console.log('Connecting to MongoDB in production mode...');
    }

    await mongoose.connect(MONGO_URI, options);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    process.exit(1); // Exit on connection failure in production
  }
};

module.exports = connectDB;
