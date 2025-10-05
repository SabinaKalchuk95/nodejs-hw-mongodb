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

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/:contactId', validateBody(updateContactSchema), ctrlWrapper(patchContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));


export default router;
