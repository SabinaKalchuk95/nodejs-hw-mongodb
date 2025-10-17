import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';

const getFilter = (userId, filter) => {
  const contactFilter = { userId };
  if (!filter) return contactFilter;
  if (filter.contactType) contactFilter.contactType = filter.contactType;
  const fav = filter.isFavorite !== undefined ? filter.isFavorite : filter.isFavourite;
  if (fav !== undefined) contactFilter.isFavorite = fav;
  return contactFilter;
};

const listContacts = async (userId, query = {}) => {
  const filter = getFilter(userId, query);
  const contacts = await ContactsCollection.find(filter).lean();
  return contacts;
};

const getContactById = async (userId, contactId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  if (!contact) throw createHttpError(404, 'Not found');
  return contact;
};

const createContact = async (userId, contactData) => {
  const data = { ...contactData, userId };
  const created = await ContactsCollection.create(data);
  return created;
};

const removeContact = async (userId, contactId) => {
  const result = await ContactsCollection.findOneAndDelete({ _id: contactId, userId });
  if (!result) throw createHttpError(404, 'Not found');
  return result;
};

const updateContact = async (userId, contactId, body) => {
  const updated = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    body,
    { new: true },
  );
  if (!updated) throw createHttpError(404, 'Not found');
  return updated;
};

export default {
  listContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
};