import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { getEnv } from '../utils/env.js'; // Використовуємо коректний імпорт

// --- Допоміжна функція для створення токенів (перенесено сюди для уникнення проблем імпорту) ---
const createSession = (userId) => {
  const accessToken = jwt.sign({ userId }, getEnv('JWT_SECRET'), {
    expiresIn: '15m', // Змінено на 15 хвилин для кращого тестування
  });
  const refreshToken = jwt.sign({ userId }, getEnv('JWT_SECRET'), {
    expiresIn: '7d', 
  });

  return { 
    accessToken, 
    refreshToken,
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 днів
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 хвилин
  };
};

// --- Допоміжна функція для збереження сесії в БД ---
const saveSession = async (userId) => {
  // 1. Створюємо Access та Refresh токени
  const sessionData = createSession(userId); 

  // 2. Зберігаємо всі необхідні дані в колекції сесій
  // ПЕРЕВІРКА: Всі обов'язкові поля передаються!
  await SessionsCollection.create({
    userId,
    accessToken: sessionData.accessToken,
    refreshToken: sessionData.refreshToken,
    refreshTokenValidUntil: sessionData.refreshTokenValidUntil, 
    accessTokenValidUntil: sessionData.accessTokenValidUntil, 
  });
  
  // 3. Повертаємо токени та терміни дії для відповіді клієнту
  return {
    accessToken: sessionData.accessToken,
    refreshToken: sessionData.refreshToken,
    accessTokenValidUntil: sessionData.accessTokenValidUntil,
    refreshTokenValidUntil: sessionData.refreshTokenValidUntil,
  };
};

// --- Реєстрація ---
export const register = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });

  return await saveSession(newUser._id);
};

// --- Вхід (Логін) ---
export const login = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'Email or password is not valid');
  }

  // Припускаємо, що у моделі User є метод checkPassword (або використовуємо bcrypt.compare)
  const isPasswordValid = await bcrypt.compare(payload.password, user.password); 
  
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is not valid');
  }

  // Створення та збереження нової сесії
  return await saveSession(user._id);
};

// --- Вихід (Логаут) ---
export const logout = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};
