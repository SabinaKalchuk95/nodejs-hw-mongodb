import Joi from 'joi';

// Схема для реєстрації користувача
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Name should be a string.',
    'string.min': 'Name must be at least 2 characters long.',
    'string.max': 'Name cannot exceed 50 characters.',
    'any.required': 'Name is required.',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a string.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password should be a string.',
    'string.min': 'Password must be at least 6 characters long.',
    'any.required': 'Password is required.',
  }),
});

// Схема для входу користувача (логін)
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a string.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password should be a string.',
    'string.min': 'Password must be at least 6 characters long.',
    'any.required': 'Password is required.',
  }),
});

// ❗️ ВІДСУТНЯ СХЕМА: Схема для оновлення сесії (Refresh Token)
// Хоча Refresh Token передається через кукі, роут все одно використовує validateBody
// для відповідності структурі middleware, тому схема потрібна.
export const refreshSessionSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required.',
    'string.base': 'Refresh token must be a string.',
  }),
});