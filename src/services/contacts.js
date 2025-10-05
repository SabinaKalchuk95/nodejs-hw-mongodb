import { ContactsCollection } from '../db/models/contacts.js';


const getFilter = (userId, filter) => {
    const contactFilter = { userId };
    if (filter) {
        if (filter.contactType) {
            contactFilter.contactType = filter.contactType;
        }
        if (filter.isFavorite !== undefined) {
            contactFilter.isFavorite = filter.isFavorite === 'true';
        }
    }
    return contactFilter;
};

export const getAllContacts = async (userId, filter = {}) => {
  const contactFilter = getFilter(userId, filter);
  return await ContactsCollection.find(contactFilter);
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload, userId) => {
  return await ContactsCollection.create({ ...payload, userId });
};

export const updateContact = async (contactId, userId, payload) => {
  const result = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
  return result;
};

export const deleteContact = async (contactId, userId) => {
  const result = await ContactsCollection.findOneAndDelete({ _id: contactId, userId });
  return result;
};
