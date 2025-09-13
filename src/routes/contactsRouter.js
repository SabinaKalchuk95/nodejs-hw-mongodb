import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/', getContactsController);          
router.get('/:contactId', getContactByIdController); 
router.post('/', createContactController);     

export default router;
