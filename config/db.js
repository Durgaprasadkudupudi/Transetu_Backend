const mongoose = require("mongoose");

const connectDB = () => {
  const MONGO_URI = "mongodb+srv://<db_username>:<db_password>@gcc.ddjem.mongodb.net/?appName=GCC";

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
