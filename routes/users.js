const express = require('express');
const { getProfile, patchProfile } = require('../controllers/users');
const { validateProfile } = require('../middlewares/validation');

const usersRoutes = express.Router();

usersRoutes.get('/users/me', getProfile);
usersRoutes.patch('/users/me', validateProfile, patchProfile);

exports.usersRoutes = usersRoutes;
