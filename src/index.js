import express from "express";
import dotenv from "dotenv";
import contactsRouter from "./routes/contactsRouter.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { initContacts } from "./db/initContacts.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/contacts", contactsRouter);

const startServer = async () => {
  await initMongoConnection();
  await initContacts();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT}`);
  });
};

startServer();
