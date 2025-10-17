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

// защищаем все роуты контактов
router.use(authenticate);

const router = express.Router();

// 1. Отримати всі контакти (з пагінацією/сортуванням)
router.get('/', ctrlWrapper(getContactsController));

// 2. Отримати контакт за ID
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController)); 

// 3. Створити контакт
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));

// 4. Оновити контакт
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

// 5. Видалити контакт
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;