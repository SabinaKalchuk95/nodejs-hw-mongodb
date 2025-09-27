import { ContactsCollection } from "../db/models/contacts.js";
import { SORT_ORDER } from '../utils/parseSortParams.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';

const Contact = ContactsCollection; 

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  
  const [contactsCount, contacts] = await Promise.all([
    Contact.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (id) => Contact.findById(id);

export const createContact = async (data) => {
  const contact = new Contact(data);
  return contact.save();
};

export const updateContact = async (id, payload) => {
  const result = await Contact.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const deleteContact = async (id) => Contact.findByIdAndDelete(id);