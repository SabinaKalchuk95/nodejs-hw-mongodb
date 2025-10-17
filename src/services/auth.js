import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '30d';

// --- 1. Вспомогательная функция для создания токенов ---
const createSession = (userId) => {
  const payload = { userId }; 

  // 1. Access Token (короткоживущий)
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m', 
  });
  
  // 2. Refresh Token (долгоживущий)
  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d', 
  });

  // Обчислення термінів дії
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const fifteenMinutes = 15 * 60 * 1000;
  
  return { 
    accessToken, 
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + fifteenMinutes),
    refreshTokenValidUntil: new Date(Date.now() + thirtyDays), 
  };
};

// --- 2. Вспомогательная функция для сохранения сессии ---
const saveSession = async (userId) => {
  const tokens = createSession(userId);

  // Для чистоты (опционально, можно убрать после отладки), удаляем старые сессии для этого пользователя
  await Session.deleteMany({ userId });

  const session = await Session.create({
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
  const userExists = await User.findOne({ email: payload.email });

  if (userExists) {
    throw createHttpError(409, 'Email already in use');
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });

  // Создаем и сохраняем сессию
  return await saveSession(user._id);
};

// ------------------------------------------------------------------
// --- 4. Сервис логина ---
export const login = async (payload) => {
  const user = await User.findOne({ email: payload.email });

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
  await Session.findOneAndDelete({ _id: sessionId });
};

// ------------------------------------------------------------------
// --- 6. Сервис обновления сессии (refresh) ---
export const refreshUsersSession = async ({ refreshToken }) => {
    let payload;

    // 1. Верификация Refresh Token
    try {
        payload = jwt.verify(refreshToken, JWT_SECRET);
    } catch (err) {
        throw createHttpError(401, 'Refresh token is invalid or expired');
    }

    const userId = payload.userId; 

    // 2. Поиск текущей сессии по токену и userId
    const session = await Session.findOne({
        userId,
        refreshToken,
    });
    
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    // 3. Проверка срока действия Refresh Token
    // Если просрочен, удаляем старую сессию и выбрасываем ошибку
    if (new Date() > session.refreshTokenValidUntil) {
        await Session.deleteOne({ _id: session._id });
        throw createHttpError(401, 'Session expired');
    }

    // 4. Генерируем новую пару токенов, сохраняем новую сессию
    const newSession = await saveSession(userId);
    
    // Удаляем старую сессию, чтобы предотвратить ее повторное использование
    await Session.deleteOne({ _id: session._id });

    return newSession;
};