// src/controllers/auth.js
import createHttpError from 'http-errors';
import { 
  register, 
  login, 
  logout,
  refreshUsersSession,
} from '../services/auth.js'; 


// --- Допоміжна функція для встановлення кукі ---
const setAuthCookies = (res, session) => {
  // Використовуємо _id (з MongoDB) як sessionId
  const sessionIdValue = session._id || session.id;

  if (!sessionIdValue) {
      throw createHttpError(500, 'Internal error: Session ID missing after login/refresh.');
  }

  const cookieOptions = {
    expires: new Date(session.refreshTokenValidUntil), 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'Lax',
  };

  // 1. Refresh Token (HTTP-Only)
  res.cookie('refreshToken', session.refreshToken, {
    ...cookieOptions,
    httpOnly: true,
  });
  
  // 2. Session ID (для клієнта) - ✅ ИСПРАВЛЕНО: Теперь устанавливается sessionId
  res.cookie('sessionId', sessionIdValue, { 
    ...cookieOptions,
    httpOnly: false, // Доступен клиенту
  });
};


// 1. Контролер реєстрації
export const registerUser = async (req, res) => {
  const session = await register(req.body);
  
  setAuthCookies(res, session); // Установка обеих куки

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      accessToken: session.accessToken,
      accessTokenValidUntil: session.accessTokenValidUntil,
    },
  });
};

// 2. Контролер логіну
export const loginUser = async (req, res) => {
  const session = await login(req.body); 
  
  if (!session || !session.refreshToken) {
     throw createHttpError(500, 'Internal error: Login service failed to return session.'); 
  }

  setAuthCookies(res, session); // Установка обеих куки

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken: session.accessToken,
      accessTokenValidUntil: session.accessTokenValidUntil,
    },
  });
};

// 3. Контролер виходу
export const logoutUser = async (req, res) => {
    // Очищаем Refresh Token и Session ID из cookie
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    
    // Удаляем сессию из БД
    if (req.session && req.session._id) {
        await logout(req.session._id);
    }
    
    res.status(204).end(); 
};

// 4. Контролер оновлення сесії
export const refreshSessionController = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; 
    
    if (!refreshToken) {
        throw createHttpError(401, 'Refresh token not provided');
    }

    const newSession = await refreshUsersSession({ refreshToken });

    setAuthCookies(res, newSession); // Установка обеих куки

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed session!',
        data: {
          accessToken: newSession.accessToken,
          accessTokenValidUntil: newSession.accessTokenValidUntil,
        },
    });
};

// 5. Контролер отримання даних користувача
export const getMeController = (req, res) => {
    if (!req.user) {
        throw createHttpError(401, 'User not authenticated');
    }

    const userWithoutPassword = {
        _id: req.user._id,
        email: req.user.email,
        name: req.user.name,
    };
    
    res.status(200).json({
        status: 200,
        message: 'Successfully found current user!',
        data: userWithoutPassword,
    });
};