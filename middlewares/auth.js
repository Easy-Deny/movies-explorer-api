const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;
const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new UnauthorizedError('user not autorized'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return next(new UnauthorizedError('user not autorized'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
