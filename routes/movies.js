const express = require('express');
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');
const { validateMovie } = require('../middlewares/validation');

const moviesRoutes = express.Router();

moviesRoutes.get('/movies', getMovies);
moviesRoutes.post('/movies', validateMovie, createMovie);
moviesRoutes.delete('/movies/:id', deleteMovieById);

exports.moviesRoutes = moviesRoutes;
