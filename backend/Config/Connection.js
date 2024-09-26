import mongoose from "mongoose";

export default async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully 🚀"); 
  } catch (error) {
    console.error("Mongo connection error ❌", error);
  }
}
