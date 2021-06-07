const Movie = require('../models/movie');
const NotFoundError = require('../errors/not_found_error');
const ValidationError = require('../errors/validation_error');
const ForbiddenError = require('../errors/forbidden_error');

exports.getMovies = (req, res) => {
  Movie.find()
    .then((movie) => res.send(movie))
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

exports.deleteMovieById = (req, res, next) => {
  const userId = req.user._id;
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Карточка с таким id отсутствует в базе'))
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenError('Вы не можете удалить эту карточку!');
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((data) => res.send(data))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Введены некорректные данные'));
      }
      next(err);
    });
};
