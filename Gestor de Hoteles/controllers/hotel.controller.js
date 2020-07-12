'use strict'

var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveHotel(req, res){
    var hotel = new Hotel();
    var idUser = req.params.idU;
    var params = req.body;

    if(idUser != req.user.sub){
        res.status(403).send({message: 'No posees los permisos para crear hoteles'});
    }else{
        if(params.name && params.address && params.availability && params.phone
          && params.qualification && params.price && params.email && params.username && params.password && params.role){
            
            Hotel.findOne({$or:[{name: params.name},
                                {username: params.username},
                                {address: params.address}]}, (err, hotelfind)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error', err});
                                    }else if(hotelfind){
                                        res.send({message: 'nombre o username o direccion en uso'});
                                    }else{
                                        hotel.name = params.name;
                                        hotel.address = params.address;
                                        hotel.phone = params.phone;
                                        hotel.qualification = params.qualification;
                                        hotel.availability = params.availability;
                                        hotel.price = params.price;
                                        hotel.email = params.email;
                                        hotel.username = params.username;
                                        hotel.role = params.role;
                    
                                        
                                        bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                                            if(err){
                                                res.status(500).send({message: 'error al encriptar contraseña'});
                                            }else if(passwordHash){
                                                hotel.password = passwordHash;

                                                hotel.save((err, saveHotel)=>{
                                                    if(err){
                                                        res.status(500).send({message: 'Error', err});
                                                    }else if(saveHotel){
                                                        res.send({message: 'Creacion de hotel exitosa', hotel: saveHotel});
                                                    }else{
                                                        res.status(418).send({message: 'Fallo al crear Hotel'});
                                                    }
                                                })
                                            }else{
                                                res.status(418).send({message: 'Error inesperado'});
                                            }
                                        })
                                    }
                                })

           }else{
               res.status(418).send({message: 'Datos insuficientes para crear un hotel'})
           }
    }
}

function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            Hotel.findOne({$or:[{username: params.username}, 
                {email: params.email}]}, (err, check)=>{
                    if(err){
                        res.status(500).send({message: 'Error', err});
                    }else if(check){
                        bcrypt.compare(params.password, check.password, (err, passworOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error al comparar'});
                            }else if(passworOk){
                                if(params.gettoken = true){
                                    res.send({token: jwt.CreateTokenHotel(check)});
                                }else{
                                    res.send({message: 'Bienvenido',user:check});
                                }
                            }else{
                                res.send({message: 'Contraseña incorrecta'});
                            }
                        });
                    }else{
                        res.send({message: 'Datos de usuario incorrectos'});
                    }
                });
        }else{
           res.send({message: 'Ingresa tu contraseña'}); 
        }
    }else{
        res.send({message: 'Ingresa tu correo o tu username'});
    }
}

function updateHotel(req, res){
    var idHotel = req.params.id;
    var update = req.body;

    if(idHotel != req.hotel.sub){
        res.status(403).send({message: 'No tiene permisos para esta ruta'});
    }else{
        Hotel.findByIdAndUpdate(idHotel, update, {new: true}, (err, hotelOk)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(hotelOk){
                res.send({message: 'Actualización éxitosa', hotel: hotelOk});
            }else{
                res.status(418).send({message: 'Error al actualizar hotel'});
            }
        })
    }
}

function removeHotel(req, res){
    var idHotel = req.params.id;
    
    if(idHotel != req.hotel.sub){
        res.status(403).send({message: 'No tiene permisos para esta ruta'});
    }else{
        Hotel.findByIdAndRemove(idHotel, (err, Removed)=>{
            if(err){
                res.status(500).send({message: 'Error', err})
            }else if(Removed){
                res.send({message: 'Eliminacion correcta', Removed});
            }else{
                res.status(418).send({message: 'Error al eliminar hotel'});
            }
        })
    }
}

function searchHotel(req, res){
    var userId = req.params.id;
    var params = req.body;
    var order;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos para esta ruta'});
    }else{
        if(params.order == 'alphabetic asc'){
            order = {name: 1};
            
        }else if(params.order == 'alphabetic desc'){
            order = {name: -1}
        }else if(params.order == 'price asc'){
            order = {price: 1}
        }else if(params.order == 'price desc'){
            order = {price: -1}
        }
    
        if(params.entryDate && params.departureDate || params.qualification){
            Hotel.find({$or:[{availability : {$gte: params.entryDate , $lt: params.departureDate}}, {qualification: params.qualification}]}, (err, hotelsearch)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(hotelsearch){
                    res.send({message: 'Búsqueda éxitosa', hotel: hotelsearch})
                }else{
                    res.status(404).send({message: 'Sin datos que mostrar'});
                }
            }).sort(order);
        }
    }
}

module.exports = {
    saveHotel,
    login,
    updateHotel,
    removeHotel,
    searchHotel
}