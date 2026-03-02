const mongoose = require("mongoose");
const colors = require("colors");

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`.red.bold);

    // Instead of exiting immediately, we can retry a few times (optional)
    // process.exit(1); // Uncomment if you want to exit on failure
  }
};

// Graceful handling for unexpected errors
process.on("unhandledRejection", (err) => {
  console.log(`UNHANDLED REJECTION! Shutting down...`.red.bold);
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = connectDB;