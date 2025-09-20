import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => ContactsCollection.find();

export const getContactById = async (id) => ContactsCollection.findById(id);

export const createContact = async (data) => {
  const contact = new ContactsCollection(data);
  return contact.save();
};

export const updateContact = async (id, payload) => {
  const result = await ContactsCollection.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const deleteContact = async (id) => ContactsCollection.findByIdAndDelete(id);