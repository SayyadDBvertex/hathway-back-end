import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const url = "mongodb://127.0.0.1:27017/mydatabase";

    const conn = await mongoose.connect(url);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
