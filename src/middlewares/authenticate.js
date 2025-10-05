import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { getEnv } from '../utils/env.js';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    
    return next(createHttpError(401, 'Authorization header is missing.'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Token must be of type Bearer.'));
  }

  let payload;
  try {
    payload = jwt.verify(token, getEnv('JWT_SECRET'));
  } catch (err) {
    return next(createHttpError(401, 'Invalid token.'));
  }

  const userId = payload.userId;

  if (!userId) {
    return next(createHttpError(401, 'Invalid token payload.'));
  }

  const session = await SessionsCollection.findOne({
    userId: userId,
    accessToken: token, 
  });
  
  if (!session) {
    return next(createHttpError(401, 'Session not found.'));
  }

  const user = await UsersCollection.findById(userId);

  if (!user) {
    return next(createHttpError(401, 'User not found.'));
  }

  req.user = user;
  req.session = session;

  next();
};

export default authenticate;
