const mongoose = require("mongoose");

const connectDB = () => {
  const MONGO_URI = "mongodb+srv://balu:balu@transetu.1brfef0.mongodb.net/?appName=Transetu";

  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message || err);
      
    });
};

module.exports = connectDB;
