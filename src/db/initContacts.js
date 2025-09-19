import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { ContactsCollection } from "./models/contacts.js"; // твоя модель

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// шлях до contacts.json у корені
const contactsPath = path.join(__dirname, "../../contacts.json");

export const initContacts = async () => {
  const count = await ContactsCollection.countDocuments();

  if (count === 0) {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    await ContactsCollection.insertMany(contacts);
    console.log("✅ Контакти додані в базу");
  } else {
    console.log("📌 Контакти вже є в базі, імпорт не потрібен");
  }
};
