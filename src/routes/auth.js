// src/routes/auth.js
import { Router } from 'express';
import { 
    registerController, 
    loginController, 
    refreshController, 
    logoutController 
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import schemas from '../schemas/authSchemas.js';

const router = Router();

// ПУБЛИЧНЫЕ РОУТЫ:
router.post('/register', validateBody(schemas.register), registerController);
router.post('/login', validateBody(schemas.login), loginController);
router.post('/refresh', refreshController); 

// ✅ ИСПРАВЛЕНО: logout должен быть публичным, чтобы очистить куки (а сессия удаляется через ID в контроллере)
router.post('/logout', logoutController); 

export default router;