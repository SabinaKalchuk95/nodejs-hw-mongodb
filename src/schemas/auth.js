import Joi from 'joi';

// Схема для валідації реєстрації
export const registerUserSchema = Joi.object({
  // Зазвичай вимагається ім'я, яке ми додали для тестування
  name: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Name must be at least 3 characters long',
    'any.required': 'Name is required',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),

  // Мінімальні вимоги до пароля
  password: Joi.string().required().min(6).messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
});

// Схема для входу (Login)
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
