'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var api = express.Router();
var mdAuth = require('../middlewares/autenthicated');

api.post('/saveUser', userController.saveUser);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
api.delete('/removeUser/:id', mdAuth.ensureAuth, userController.removeUser);
api.post('/login', userController.login);

module.exports = api;