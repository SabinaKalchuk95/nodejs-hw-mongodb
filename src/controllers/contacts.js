// src/controllers/contacts.js
import * as contactsService from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams, calculatePaginationData } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

// Контролер для отримання всіх контактів поточного користувача з пагінацією/сортуванням/фільтрацією
export const getContactsController = async (req, res) => {
  const userId = req.user._id;

  // 1. Парсинг параметрів
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  
  // 2. Отримання контактів та загальної кількості
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

// ❗ ИСПРАВЛЕНИЕ ЗАВИСАНИЯ (❌ POST /contacts hangs): Контроллер создания контакта
export const createContactController = async (req, res) => {
  // Получаем ID пользователя из req.user (устанавливается authenticate)
  const userId = req.user._id; 
  
  // Вызываем сервис для создания контакта (предполагая, что сервис contactsService.createContact существует)
  const newContact = await contactsService.createContact(userId, req.body); 

  // ✅ Завершение запроса, чтобы он не зависал
  res.status(201).json({
    status: 201,
    message: 'Successfully created contact',
    data: newContact,
  });
};

// ... (остальной код, который вы обозначили /* ... */)
export const getContactByIdController = async (req, res) => { /* ... */ };
export const patchContactController = async (req, res) => { /* ... */ };
export const deleteContactController = async (req, res) => { /* ... */ };