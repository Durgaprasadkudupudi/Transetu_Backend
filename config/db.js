const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment or use localhost for development
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/transetu_exercises";
    
    // Extract database name from URI or use default
    const dbName = process.env.DB_NAME || 'transetu_exercises';
    
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      dbName, // Explicitly set database name
    };

    if (process.env.NODE_ENV === 'production') {
      console.log('Connecting to MongoDB Atlas in production mode...');
      // Log partial URI (hide credentials) for debugging
      const sanitizedUri = MONGO_URI.replace(/:\/\/.+@/, '://*****:*****@');
      console.log('Using connection string:', sanitizedUri);
    }

    await mongoose.connect(MONGO_URI, options);
    console.log(`MongoDB connected successfully to database: ${dbName}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    if (err.name === 'MongoServerSelectionError') {
      console.error("Could not reach MongoDB server. Please check:");
      console.error("1. Network connectivity");
      console.error("2. MongoDB Atlas IP whitelist settings");
      console.error("3. Database user credentials");
    }
    process.exit(1); // Exit on connection failure in production
  }
};

module.exports = connectDB;
