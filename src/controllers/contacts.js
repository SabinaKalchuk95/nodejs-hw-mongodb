import mongoose from 'mongoose';
import { getAllContacts, getContactById, createContact } from '../services/contacts.js';

// GET /contacts
export const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// GET /contacts/:contactId
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID' });
    }

    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// POST /contacts
export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite = false, contactType = 'personal' } = req.body;

    if (!name || !phoneNumber) {
      return res.status(400).json({
        status: 400,
        message: 'Missing required fields: name and phoneNumber',
      });
    }

    const newContact = await createContact({ name, phoneNumber, email, isFavourite, contactType });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};
