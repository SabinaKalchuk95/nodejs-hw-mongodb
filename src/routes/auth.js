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
import { registerSchema, loginSchema } from '../schemas/auth.js';
import authenticate from '../middlewares/authenticate.js'; 

const router = Router();

// ❗ ИСПРАВЛЕННЫЕ ПУБЛИЧНЫЕ РОУТЫ: Добавляем сюда logout!
router.post('/register', validateBody(registerSchema), ctrlWrapper(registerUser));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));
router.post('/refresh', ctrlWrapper(refreshSessionController)); 
router.post('/logout', ctrlWrapper(logoutUser)); // ❗ ИСПРАВЛЕНО: УБРАН authenticate

// ЗАЩИЩЕННЫЕ РОУТЫ: (Остается только getMe)
router.get('/me', authenticate, ctrlWrapper(getMeController)); 

export default router;