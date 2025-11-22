import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.BDD_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};