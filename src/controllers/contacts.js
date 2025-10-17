// src/controllers/contacts.js
import contactsService from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams, calculatePaginationData } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// Контролер для отримання всіх контактів поточного користувача з пагінацією/сортуванням/фільтрацією
export const getContactsController = async (req, res) => {
  // ✅ КРИТИЧНОЕ ИСПРАВЛЕНИЕ: Получаем ID пользователя из req.user (установлен в authenticate)
  const userId = req.user._id;

  // 1. Парсинг параметрів
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  
  // 2. Получение контактов и общего количества (передаем userId)
  const contacts = await contactsService.getAllContacts(userId, {
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });

  const totalItems = await contactsService.countAllContacts(userId, filter);
  const pagination = calculatePaginationData(totalItems, perPage, page);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
    pagination, 
  });
};

// Контролер для створення контакту
export const createContactController = async (req, res) => {
    // ✅ КРИТИЧНОЕ ИСПРАВЛЕНИЕ: Получаем ID владельца из req.user
    const userId = req.user._id; 
    
    // Передаем userId в сервис
    const contact = await contactsService.createContact(userId, req.body); 

    res.status(201).json({
        status: 201,
        message: 'Successfully created contact',
        data: contact,
    });
};

// Контролер для отримання контакту за ID
export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id; // Получаем ID владельца

    const contact = await contactsService.getContactById(contactId, userId); // Передаем userId

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}`,
        data: contact,
    });
};

// Контролер для оновлення контакту
export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id; // Получаем ID владельца

    const result = await contactsService.updateContact(contactId, userId, req.body); // Передаем userId

    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully updated contact!',
        data: result,
    });
};

// Контролер для видалення контакту
export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id; // Получаем ID владельца

    const result = await contactsService.deleteContact(contactId, userId); // Передаем userId

    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).end(); 
};

import contactsService from '../services/contacts.js';

const list = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts(req.user._id, req.query);
    res.json({ status: 200, message: 'OK', data: contacts });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.user._id, req.params.id);
    res.json({ status: 200, message: 'OK', data: contact });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const created = await contactsService.createContact(req.user._id, req.body);
    res.status(201).json({ status: 201, message: 'Contact created', data: created });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await contactsService.removeContact(req.user._id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const updated = await contactsService.updateContact(req.user._id, req.params.id, req.body);
    res.json({ status: 200, message: 'Contact updated', data: updated });
  } catch (err) {
    next(err);
  }
};

export default { list, getById, create, remove, update };