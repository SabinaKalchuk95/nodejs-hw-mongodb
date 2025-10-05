import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err.errors,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      message: 'Validation error',
      data: err.details,
    });
  }

  if (err.name === 'CastError' || err.name === 'MongoError') {
     return res.status(400).json({
        status: 400,
        message: 'Invalid data format or database error.',
    });
  }

  // Логуємо невідому помилку для діагностики
  console.error(err);

  // Відповідь для всіх інших невідомих помилок
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
  });
};