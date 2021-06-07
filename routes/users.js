const express = require('express');
const { getMyProfile, patchMyProfile } = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/users/me', getMyProfile);
usersRoutes.patch('/users/me', patchMyProfile);

exports.usersRoutes = usersRoutes;
