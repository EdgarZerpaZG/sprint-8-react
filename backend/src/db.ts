import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI as string);
let db: Db;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME);
    console.log("✔ MongoDB connected");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}