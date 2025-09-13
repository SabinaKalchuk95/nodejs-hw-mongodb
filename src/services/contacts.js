import Contact from '../db/models/contacts.js';

export const getAllContacts = async () => {
  return Contact.find();
};

export const getContactById = async (id) => {
  return Contact.findById(id);
};


export const createContact = async (data) => {
  const contact = new Contact(data);
  return contact.save();
};
