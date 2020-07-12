'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var api = express.Router();
var mdAuth = require('../middlewares/autenthicated');

api.post('/saveHotel/:idU', mdAuth.ensureAuthAdmin, hotelController.saveHotel);
api.post('/login', hotelController.login);
api.put('/updateHotel/:id', mdAuth.ensureAuthAdminHotel, hotelController.updateHotel);
api.delete('/removeHotel/:id', mdAuth.ensureAuthAdminHotel, hotelController.removeHotel);
api.post('/searchHotel/:id', mdAuth.ensureAuth, hotelController.searchHotel);

module.exports = api;