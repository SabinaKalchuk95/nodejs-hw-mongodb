import * as contactsService from '../services/contacts.js';
import createHttpError from 'http-errors';

// Контролер для отримання всіх контактів поточного користувача
export const getContactsController = async (req, res) => {
  const userId = req.user._id; 
  
  const contacts = await contactsService.getAllContacts(userId);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
};

// Контролер для отримання контакту за ID
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await contactsService.getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

// Контролер для створення нового контакту
export const createContactController = async (req, res) => {
  const userId = req.user._id;

  const contact = await contactsService.createContact(req.body, userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created contact',
    data: contact,
  });
};

// Контролер для оновлення контакту
export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await contactsService.updateContact(contactId, req.body, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact',
    data: contact,
  });
};

// Контролер для видалення контакту
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id; 

  const deletedContact = await contactsService.deleteContact(contactId, userId);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send(); 
};