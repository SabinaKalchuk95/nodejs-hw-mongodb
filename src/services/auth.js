import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { REFRESH_SECRET, JWT_SECRET } from '../utils/env.js';


// --- Допоміжна функція для створення токенів ---
const createSession = (userId) => {
  // Пейлоад токена містить ID користувача
  const payload = { userId }; 
  
  // 1. Access Token (короткоживучий, JWT_SECRET)
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m', 
  });
  
  // 2. Refresh Token (довгоживучий, REFRESH_SECRET)
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

// --- Допоміжна функція для збереження/оновлення сесії в БД ---
const saveSession = async (userId) => {
  // 1. Створюємо Access та Refresh токени
  const sessionData = createSession(userId); 

  // 2. Зберігаємо/оновлюємо сесію у БД
  const session = await SessionsCollection.findOneAndUpdate(
    { userId },
    {
      userId,
      ...sessionData,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  
  // 3. Повертаємо дані сесії
  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    accessTokenValidUntil: session.accessTokenValidUntil,
    refreshTokenValidUntil: session.refreshTokenValidUntil,
  };
};

// --- СЕРВІСИ АВТОРИЗАЦІЇ ---

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

export const login = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'Email or password is not valid');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password); 
  
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is not valid');
  }

  return await saveSession(user._id);
};

export const logout = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};


// ! ВИПРАВЛЕННЯ: ЕКСПОРТ refreshUsersSession
export const refreshUsersSession = async ({ refreshToken }) => {
    let payload;

    // 1. Верифікація Refresh Token
    try {
        // Використовуємо REFRESH_SECRET для верифікації
        payload = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
        throw createHttpError(401, 'Refresh token is invalid or expired');
    }

    const userId = payload.userId; 

    // 2. Пошук поточної сесії за токеном та userId
    const session = await SessionsCollection.findOne({
        userId,
        refreshToken,
    });
    
    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    // 3. Видалення старої сесії (старий Refresh Token)
    await SessionsCollection.deleteOne({ _id: session._id });

    // 4. Створення нової сесії (новий Access Token та Refresh Token)
    return await saveSession(userId); 
};
