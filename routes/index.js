const routes = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { validateSignUp, validateSignIn } = require('../middlewares/validation');
const { auth } = require('../middlewares/auth');
const { usersRoutes } = require('./users');
const { moviesRoutes } = require('./movies');
const NotFoundError = require('../errors/not_found_error');

routes.post('/signup', validateSignUp, createUser);
routes.post('/signin', validateSignIn, login);

routes.use(auth);

routes.use(usersRoutes);
routes.use(moviesRoutes);

routes.all('*', () => {
  throw new NotFoundError('Такой страницы не существует');
});

module.exports = routes;
