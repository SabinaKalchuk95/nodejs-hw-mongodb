// src/services/contacts.js
import { ContactsCollection } from '../db/models/contacts.js';

// Допоміжна функція для побудови фільтра
const getFilter = (userId, filter) => {
    const contactFilter = { userId };
    
    if (filter) {
        if (filter.contactType) {
            contactFilter.contactType = filter.contactType;
        }
        // isFavourite має бути булевим (true/false)
        if (filter.isFavourite !== undefined) { 
            contactFilter.isFavourite = filter.isFavourite;
        }
    }
    return contactFilter;
};

// 1. Отримання всіх контактів з пагінацією, сортуванням та фільтром
export const getAllContacts = async (userId, { page = 1, perPage = 10, sortOrder = 'asc', sortBy = 'name', filter = {} }) => {
  const contactFilter = getFilter(userId, filter);

  const skip = (page - 1) * perPage;
  
  const contacts = await ContactsCollection.find(contactFilter)
    .skip(skip)
    .limit(perPage)
    // Динамічне сортування за полем та порядком
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }); 
    
  return contacts;
};

// 2. Функція для підрахунку загальної кількості контактів
export const countAllContacts = async (userId, filter = {}) => {
  const contactFilter = getFilter(userId, filter);
  return await ContactsCollection.countDocuments(contactFilter);
};

// ... (інші сервіси залишаються такими ж, як ми їх виправляли раніше)
export const getContactById = async (contactId, userId) => { /* ... */ };
export const createContact = async (payload, userId) => { /* ... */ };
export const updateContact = async (contactId, userId, payload) => { /* ... */ };
export const deleteContact = async (contactId, userId) => { /* ... */ };