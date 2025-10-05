import mongoose from 'mongoose';
import { getEnv } from '../utils/env.js';

export const initMongoConnection = async () => {
  try {
    const user = getEnv('MONGODB_USER');
    const password = getEnv('MONGODB_PASSWORD');
    const host = getEnv('MONGODB_HOST');
    const dbName = getEnv('MONGODB_DB_NAME');
    const appName = getEnv('MONGODB_APP_NAME');

    
    const uri = `mongodb+srv://${user}:${password}@${host}/${dbName}?retryWrites=true&w=majority&appName=${appName}`;

    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB via Mongoose!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};