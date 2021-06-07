const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not_found_error');
const ValidationError = require('../errors/validation_error');
const AuthError = require('../errors/auth_error');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};

exports.getMyProfile = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .orFail(() => { throw new NotFoundError('Пользователь по заданному id отсутствует в базе'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Введены некорректные данные'));
      }
      next(err);
    });
};

exports.patchMyProfile = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new ValidationError('Введены некорректные данные');
  }
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFoundError('Пользователь по заданному id отсутствует в базе'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Введены некорректные данные'));
      }
      next(err);
    });
};
