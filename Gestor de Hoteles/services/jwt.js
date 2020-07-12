'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_secreta';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        iat:  moment().unix(),
        exp: moment().add(15, "minutes").unix()
    }
    return jwt.encode(payload, key);
}

exports.CreateTokenHotel = (hotel)=>{
    var payload = {
        sub: hotel._id,
        name: hotel.name,
        address: hotel.address,
        phone: hotel.phone,
        qualification: hotel.qualification,
        availability: hotel.availability,
        price: hotel.price,
        email: hotel.email,
        username: hotel.username,
        role: hotel.role,
        iat: moment().unix(),
        exp: moment().add(15, 'minutes').unix()
    }
    return jwt.encode(payload, key);
}

