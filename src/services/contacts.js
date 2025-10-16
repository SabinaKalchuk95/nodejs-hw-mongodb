import { ContactsCollection } from '../db/models/contacts.js';

// Допоміжна функція для побудови фільтра
const getFilter = (userId, filter) => {
    // ✅ ФІКС: Використовуємо 'userId' для пошуку (відповідає моделі)
    const contactFilter = { userId: userId }; 
    
    if (filter) {
        if (filter.contactType) {
            contactFilter.contactType = filter.contactType;
        }
        if (filter.isFavorite !== undefined) { 
            contactFilter.isFavorite = filter.isFavorite;
        }
    }
    return contactFilter;
};

export const getAllContacts = async (userId, { page = 1, perPage = 10, sortOrder = 'asc', sortBy = 'name', filter = {} }) => {
  const contactFilter = getFilter(userId, filter);

  const skip = (page - 1) * perPage;
  
  const contacts = await ContactsCollection.find(contactFilter)
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }); 
    
  return contacts;
};

export const countAllContacts = async (userId, filter = {}) => {
  const contactFilter = getFilter(userId, filter);
  return await ContactsCollection.countDocuments(contactFilter);
};

export const createContact = async (userId, payload) => { 
  const newContact = await ContactsCollection.create({
    ...payload,
    // 🔥 ФІНАЛЬНЕ ВИПРАВЛЕННЯ: Поле для Mongoose має бути 'userId'
    userId: userId, 
  });
  return newContact;
};


export const getContactById = async (contactId, userId) => {
    // Шукаємо за _id та userId
    return ContactsCollection.findOne({ _id: contactId, userId: userId });
};

export const updateContact = async (contactId, userId, payload) => {
    return ContactsCollection.findOneAndUpdate(
        // Шукаємо за _id та userId
        { _id: contactId, userId: userId },
        payload,
        { new: true },
    );
};

export const deleteContact = async (contactId, userId) => {
    // Шукаємо за _id та userId
    return ContactsCollection.findOneAndDelete({ _id: contactId, userId: userId });
};