import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected successfully ${conn.connection.name}`);
  } catch (error) {
    console.log("MongoDB connection error",error);
  }
};
