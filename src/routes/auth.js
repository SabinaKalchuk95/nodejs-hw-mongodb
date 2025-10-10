import { Router } from 'express';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshSessionController, 
    getMeController 
} from '../controllers/auth.js'; 

import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/auth.js'; // refreshSessionSchema не потрібна для body
import authenticate from '../middlewares/authenticate.js'; 

const router = Router();

// ПУБЛІЧНІ РОУТИ: Не мають authenticate
router.post('/register', validateBody(registerSchema), ctrlWrapper(registerUser));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));
router.post('/refresh', ctrlWrapper(refreshSessionController)); 

// ЗАХИЩЕНІ РОУТИ: Мають authenticate
router.post('/logout', authenticate, ctrlWrapper(logoutUser));
router.get('/me', authenticate, ctrlWrapper(getMeController));

export default router;