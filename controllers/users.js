const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not_found_error');
const ValidationError = require('../errors/validation_error');
const AuthError = require('../errors/auth_error');
const CreationError = require('../errors/creation_error');

// const { NODE_ENV, JWT_SECRET } = process.env;

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // const token = jwt.sign({ _id: user._id },
      // `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password) {
    throw new AuthError('Пароль или почта введены некорректно');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        next(new CreationError('Для этого email уже создан пльзователь'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

exports.getProfile = (req, res, next) => {
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

exports.patchProfile = (req, res, next) => {
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
