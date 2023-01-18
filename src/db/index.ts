import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export async function connectDb() {
  await mongoose.connect(process.env.MONGO_DB);
}
