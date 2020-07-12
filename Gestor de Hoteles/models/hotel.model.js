'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    address: String,
    phone: String,
    qualification: String,
    availability: Date,
    price: Number,
    email: String,
    username: String,
    password: String,
    role: String
});

module.exports = mongoose.model('hotel', hotelSchema);