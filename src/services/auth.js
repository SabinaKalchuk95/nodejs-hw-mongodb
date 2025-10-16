import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
// ⚠️ КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Используем getEnv() для доступа к переменным окружения
import { getEnv } from '../utils/env.js'; 


// --- 1. Вспомогательная функция для создания токенов ---
const createSession = (userId) => {
  const payload = { userId }; 
  
  // Получаем секреты через getEnv() для надежности
  const JWT_SECRET = getEnv('JWT_SECRET'); 
  const REFRESH_SECRET = getEnv('REFRESH_SECRET');

  // 1. Access Token (короткоживущий)
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m', 
  });
  
  // 2. Refresh Token (долгоживущий)
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: '7d', 
  });

  // Обчислення термінів дії
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const fifteenMinutes = 15 * 60 * 1000;
  
  return { 
    accessToken, 
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + fifteenMinutes),
    refreshTokenValidUntil: new Date(Date.now() + sevenDays), 
  };
};

// --- 2. Вспомогательная функция для сохранения сессии ---
const saveSession = async (userId) => {
  const tokens = createSession(userId);

  // Для чистоты (опционально, можно убрать после отладки), удаляем старые сессии для этого пользователя
  await SessionsCollection.deleteOne({ userId });

  const session = await SessionsCollection.create({
    userId,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenValidUntil: tokens.accessTokenValidUntil,
    refreshTokenValidUntil: tokens.refreshTokenValidUntil,
  });

  return {
    _id: session._id,
    accessToken: session.accessToken,
    accessTokenValidUntil: session.accessTokenValidUntil,
    refreshToken: session.refreshToken,
    refreshTokenValidUntil: session.refreshTokenValidUntil,
  };
};

// ------------------------------------------------------------------
// --- 3. Сервис регистрации ---
export const register = async (payload) => {
  const userExists = await UsersCollection.findOne({ email: payload.email });

  if (userExists) {
    throw createHttpError(409, 'Email already in use');
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });

  // Создаем и сохраняем сессию
  return await saveSession(user._id);
};

// ------------------------------------------------------------------
// --- 4. Сервис логина ---
export const login = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'Email or password is not valid');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password); 
  
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is not valid');
  }

  // Создаем и сохраняем сессию
  return await saveSession(user._id);
};

// ------------------------------------------------------------------
// --- 5. Сервис логаута ---
export const logout = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// ------------------------------------------------------------------
// --- 6. Сервис обновления сессии (refresh) ---
export const refreshUsersSession = async ({ refreshToken }) => {
    let payload;

    // 1. Верификация Refresh Token
    try {
        const REFRESH_SECRET = getEnv('REFRESH_SECRET'); // Получаем секрет здесь
        payload = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
        throw createHttpError(401, 'Refresh token is invalid or expired');
    }

    const userId = payload.userId; 

    // 2. Поиск текущей сессии по токену и userId
    const session = await SessionsCollection.findOne({
        userId,
        refreshToken,
    });
    
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    // 3. Проверка срока действия Refresh Token
    // Если просрочен, удаляем старую сессию и выбрасываем ошибку
    if (new Date() > session.refreshTokenValidUntil) {
        await SessionsCollection.deleteOne({ _id: session._id });
        throw createHttpError(401, 'Session expired');
    }

    // 4. Генерируем новую пару токенов, сохраняем новую сессию
    const newSession = await saveSession(userId);
    
    // Удаляем старую сессию, чтобы предотвратить ее повторное использование
    await SessionsCollection.deleteOne({ _id: session._id });

    return newSession;
};