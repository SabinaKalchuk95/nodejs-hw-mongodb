// src/middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const authenticate = async (req, res, next) => {
  try {
    const auth = req.get('Authorization') || '';
    const [type, token] = auth.split(' ');
    if (type !== 'Bearer' || !token) throw createHttpError(401, 'Not authorized');

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') throw createHttpError(401, 'Access token expired');
      throw createHttpError(401, 'Invalid access token');
    }

    const user = await User.findById(payload.id).select('-password');
    if (!user) throw createHttpError(401, 'User not found');

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;