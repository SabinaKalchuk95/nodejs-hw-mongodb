import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_SECRET } from './env.js';

/**
 * Створює Access Token та Refresh Token, включаючи userId у пейлоад.
 * @param {string} userId - ID користувача, для якого створюється сесія.
 * @returns {{accessToken: string, refreshToken: string, refreshTokenValidUntil: string}}
 */
export const createSession = (userId) => {
  // Пейлоад, який буде підписаний (містить ID користувача)
  const payload = {
    id: userId,
  };

  // 1. Токен доступу (короткоживучий, підписаний секретом JWT_SECRET)
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m', 
  });

  // 2. Токен оновлення (довгоживучий, підписаний секретом REFRESH_SECRET)
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: '7d', 
  });

  // 3. Термін дії Refresh Token
  const refreshTokenValidUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 днів

  return {
    accessToken,
    refreshToken,
    refreshTokenValidUntil: refreshTokenValidUntil.toISOString(),
  };
};