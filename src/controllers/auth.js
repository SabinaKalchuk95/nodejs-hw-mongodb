import createHttpError from 'http-errors';
import { 
  register, 
  login, 
  logout,
  refreshUsersSession, // Импорт сервиса для обновления токена
} from '../services/auth.js'; 


// Контроллер регистрации
export const registerUser = async (req, res) => {
  const session = await register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: session,
  });
};

// Контроллер логіну
export const loginUser = async (req, res) => {
  const session = await login(req.body); 

  // Встановлення refreshToken як HTTP-Only cookie
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(session.refreshTokenValidUntil), 
    secure: true, // Встановіть на true, якщо використовуєте HTTPS
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

// Контролер виходу
export const logoutUser = async (req, res) => {
    // Очищаємо Refresh Token з cookie
    res.clearCookie('refreshToken');
    
    // Видаляємо сесію з БД
    if (req.session) {
        await logout(req.session._id);
    }
    
    res.status(204).send();
};


// ❗️ ИСПРАВЛЕННОЕ ИМЯ: refreshSessionController
export const refreshSessionController = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; 
    
    if (!refreshToken) {
        throw createHttpError(401, 'Refresh token not provided');
    }

    // Викликаємо сервіс для оновлення сесії
    const newSession = await refreshUsersSession({ refreshToken });

    // Встановлення нового refreshToken як HTTP-Only cookie
    res.cookie('refreshToken', newSession.refreshToken, {
      httpOnly: true,
      expires: new Date(newSession.refreshTokenValidUntil),
      secure: true, 
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

// Контролер отримання даних користувача
export const getMeController = (req, res) => {
    // req.user встановлюється в authenticate middleware
    if (!req.user) {
        throw createHttpError(401, 'User not authenticated');
    }

    // Повертаємо дані користувача без хешованого пароля
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