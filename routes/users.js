const express = require('express');
const { getProfile, patchProfile } = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/users/me', getProfile);
usersRoutes.patch('/users/me', patchProfile);

exports.usersRoutes = usersRoutes;
