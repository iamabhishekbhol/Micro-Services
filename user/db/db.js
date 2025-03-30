const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("User Service MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

module.exports = connectDB;
