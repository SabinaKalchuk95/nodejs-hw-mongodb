import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const initMongoConnection = async () => {
  const {
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_DB_NAME,
  } = process.env;

  const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    await mongoose.connect(connectionString);
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};
