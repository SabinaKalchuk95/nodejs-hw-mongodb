// src/routes/contacts.js
import express from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js'; 
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import authenticate from '../middlewares/authenticate.js'; 
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../schemas/contacts.js';
import { isValidId } from '../middlewares/isValidId.js'; // Імпорт валідатора ID

const router = express.Router();

// Застосовуємо аутентифікацію до ВСІХ роутів контактів
router.use(authenticate);

// 1. Отримати всі контакти (з пагінацією/сортуванням)
router.get('/', ctrlWrapper(getContactsController));

// 2. Отримати контакт за ID
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController)); // ДОДАНО isValidId

// 3. Створити контакт
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));

// 4. Оновити контакт
router.patch(
  '/:contactId',
  isValidId, // ДОДАНО isValidId
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

// 5. Видалити контакт
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController)); // ДОДАНО isValidId

export default router;