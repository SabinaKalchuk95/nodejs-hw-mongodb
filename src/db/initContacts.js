import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { ContactsCollection } from "./models/contacts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "../../contacts.json");

export const initContacts = async () => {
  const count = await ContactsCollection.countDocuments();

  if (count === 0) {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    // Вставка контактів без дублювання
    for (const contact of contacts) {
      await ContactsCollection.updateOne(
        { email: contact.email || contact.phoneNumber },
        { $setOnInsert: contact },
        { upsert: true }
      );
    }

    console.log("✅ Contacts imported from contacts.json");
  } else {
    console.log("📌 Contacts already exist in DB, skipping import");
  }
};
