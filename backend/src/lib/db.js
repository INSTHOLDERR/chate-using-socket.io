import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { MONGODB_URI } = process.env;

    const connection = await mongoose.connect(MONGODB_URI);

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};