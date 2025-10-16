// src/middlewares/authenticate.js
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { getEnv } from '../utils/env.js';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header is missing.'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Token must be of type Bearer.'));
  }

  let payload;
  try {
    // Верифікація токена з використанням JWT_SECRET
    payload = jwt.verify(token, getEnv('JWT_SECRET'));
  } catch (err) {
    // Помилка, якщо токен невалідний або прострочений
    return next(createHttpError(401, 'Invalid token.'));
  }

  const userId = payload.userId; 

  // Пошук сесії, що відповідає цьому користувачу ТА токену
  const session = await SessionsCollection.findOne({
    userId: userId,
    accessToken: token, 
  });

  if (!session) {
    return next(createHttpError(401, 'Session not found.'));
  }
  
  const user = await UsersCollection.findById(userId);

  if (!user) {
    return next(createHttpError(401, 'User not found.'));
  }

  // ✅ КРИТИЧНОЕ ДЕЙСТВИЕ: Сохраняем user и session в req
  req.user = user; 
  req.session = session;

  next();
};

export default authenticate;