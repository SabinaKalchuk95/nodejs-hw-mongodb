import { Router } from 'express';
// import { validateBody } from '../middlewares/validateBody.js';
// import { userSigninSchema, userSignupSchema } from '../validation/auth.js';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  // refreshController // ВИДАЛЕНО: Цей контролер ще не існує
} from '../controllers/auth.js';
import authenticate from '../middlewares/authenticate.js';

const authRouter = Router();

// Маршрут реєстрації
authRouter.post('/signup', registerUser); 

// Маршрут входу
authRouter.post('/signin', loginUser); 

// Маршрут виходу (тепер захищений)
authRouter.post('/logout', authenticate, logoutUser); 

// authRouter.post('/refresh', refreshController); // ВИДАЛЕНО: Цей маршрут ще не готовий

export default authRouter;
