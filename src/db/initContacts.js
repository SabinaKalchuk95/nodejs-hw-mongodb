
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { ContactsCollection } from "./models/contact.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const contactsPath = path.join(__dirname, "../../contacts.json");

export const initContacts = async () => {
  const count = await ContactsCollection.countDocuments();

  if (count === 0) {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    await ContactsCollection.insertMany(contacts);
    console.log("✅ Контакти з contacts.json додані до бази");
  } else {
    console.log("📌 Контакти вже є в базі, імпорт не потрібен");
  }
};
