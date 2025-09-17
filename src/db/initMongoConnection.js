import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const initMongoConnection = async () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DB_NAME } = process.env;

  if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_HOST || !MONGODB_DB_NAME) {
    console.error("❌ Missing required MongoDB environment variables!");
    process.exit(1);
  }

  const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString);
    console.log("✅ Mongo connection successfully established!");
  } catch (error) {
    console.error("❌ Mongo connection error:", error);
    process.exit(1);
  }
};
