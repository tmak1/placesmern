import jwt from 'jsonwebtoken';
import HttpError from '../shared/HttpError.js';

export default function checkAuth(req, res, next) {
  let token;
  try {
    token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new HttpError('Unauthenticated no access', 422));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new HttpError('Unauthenticated no access', 422));
    }
    req.userData = { userId: decoded.userId, token };
    next();
  } catch (error) {
    throw error;
  }
}
