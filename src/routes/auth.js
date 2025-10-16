// src/routes/auth.js
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

// ПУБЛИЧНЫЕ РОУТЫ:
router.post('/register', validateBody(registerSchema), ctrlWrapper(registerUser));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginUser));
router.post('/refresh', ctrlWrapper(refreshSessionController)); 

// ✅ ИСПРАВЛЕНО: logout должен быть публичным, чтобы очистить куки (а сессия удаляется через ID в контроллере)
router.post('/logout', ctrlWrapper(logoutUser)); 

// ЗАЩИЩЕННЫЕ РОУТЫ:
// ✅ ИСПРАВЛЕНО: Для getMe нужен authenticate (токен)
router.get('/me', authenticate, ctrlWrapper(getMeController)); 

export default router;