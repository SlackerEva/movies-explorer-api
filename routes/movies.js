const express = require('express');
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');

const moviesRoutes = express.Router();

moviesRoutes.get('/movies', getMovies);
moviesRoutes.post('/movies', express.json(), createMovie);
moviesRoutes.delete('/movies/movieId', deleteMovieById);

exports.moviesRoutes = moviesRoutes;
