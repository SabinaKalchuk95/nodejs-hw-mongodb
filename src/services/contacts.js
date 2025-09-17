import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => ContactsCollection.find();

export const getContactById = async (id) => ContactsCollection.findById(id);

export const createContact = async (data) => {
  const contact = new ContactsCollection(data);
  return contact.save();
};
