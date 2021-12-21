const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AuthError = require('../errors/auth_error');

dotenv.config();

const { JWT_SECRET, NODE_ENV } = process.env;

exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AuthError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload;
  return next();
};
