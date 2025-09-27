import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    next(createHttpError(400, `Validation failed: ${errorMessage}`));
  }
};