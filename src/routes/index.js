import { Router } from 'express';


import contactsRouter from '../routes/contacts.js';
import authRouter from '../routes/auth.js';

const router = Router();


router.use('/api/contacts', contactsRouter);
router.use('/api/auth', authRouter); 
export default router;
