import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { initContacts } from "./db/initContacts.js";
import dotenv from 'dotenv';

dotenv.config();

const startServer = async () => {
    try {
        await initMongoConnection();
        await initContacts();
        setupServer();
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();