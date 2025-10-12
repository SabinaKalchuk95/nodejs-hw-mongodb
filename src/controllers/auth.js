import createHttpError from 'http-errors';
import { 
  register, 
  login, 
  logout,
  refreshUsersSession,
} from '../services/auth.js'; 


// 1. Контролер реєстрації
export const registerUser = async (req, res) => {
  const session = await register(req.body);
  
  // ❗ ИСПРАВЛЕНИЕ: Добавляем установку refreshToken в cookie, которой не было
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(session.refreshTokenValidUntil), 
    secure: process.env.NODE_ENV === 'production', // Используем env
    sameSite: 'Lax',
  });

  // ❗ ИСПРАВЛЕНИЕ (❌ register response): Возвращаем ТОЛЬКО Access Token
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      accessToken: session.accessToken,
      accessTokenValidUntil: session.accessTokenValidUntil,
    },
  });
};

// 2. Контролер логіну (минимальное исправление secure)
export const loginUser = async (req, res) => {
  const session = await login(req.body); 

  // Встановлення refreshToken як HTTP-Only cookie
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(session.refreshTokenValidUntil), 
    secure: process.env.NODE_ENV === 'production', // Используем env
    sameSite: 'Lax',
  });

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
    // Очищаємо Refresh Token з cookie
    res.clearCookie('refreshToken');
    
    // Видаляємо сесію з БД
    if (req.session) {
        await logout(req.session._id);
    }
    
    // ❗ ИСПРАВЛЕНИЕ (❌ logout response): Статус 204 No Content
    res.status(204).end(); // Используем .end() для чистого 204
};

// 4. Контролер оновлення сесії
export const refreshSessionController = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; 
    
    if (!refreshToken) {
        throw createHttpError(401, 'Refresh token not provided');
    }

    const newSession = await refreshUsersSession({ refreshToken });

    res.cookie('refreshToken', newSession.refreshToken, {
      httpOnly: true,
      expires: new Date(newSession.refreshTokenValidUntil),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });

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
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
    };

    res.status(200).json({
        status: 200,
        message: 'Successfully retrieved user info',
        data: userWithoutPassword,
    });
};