

const errorHandler = (err, req, res, next) => {
  const { status = 500, message = "Something went wrong", data = {} } = err;
  res.status(status).json({
    status,
    message,
    data,
  });
};

export default errorHandler;