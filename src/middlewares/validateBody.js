

export const validateBody = (schema) => async (req, res, next) => {
  console.log("INFO: Validation is temporarily bypassed for JWT test.");
  next();
};