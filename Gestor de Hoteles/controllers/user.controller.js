'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if( params.name &&
        params.username &&
        params.email &&
        params.password &&
        params.role){
            User.findOne({$or:[{username: params.username}, {email: params.email}]}, (err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general', err})
                }else if(userFind){
                    res.send({message: 'usuario o correo ya utilizado'});
                }else{
                    user.name = params.name;
                    user.username = params.username;
                    user.email = params.email;
                    user.role = params.role;

                    bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                        if(err){
                            res.status(500).send({message: 'Error al encriptar contraseña'});
                        }else if(passwordHash){
                            user.password = passwordHash;

                            user.save((err, userSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error', err});
                                }else if(userSaved){
                                    res.send({message: 'Cración de Usuario éxitosa', user: userSaved});
                                }else{
                                    res.status(404).send({message: 'Fallo al crear usuario'});
                                }
                            });
                        }else{
                            res.status(418).send({message: 'Error inesperado'});
                        }
                    });
                }
            });
    }else{
        res.send({message: 'Ingresa todos los datos'});
    }
}

function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username}, 
                {email: params.email}]}, (err, check)=>{
                    if(err){
                        res.status(500).send({message: 'Error', err});
                    }else if(check){
                        bcrypt.compare(params.password, check.password, (err, passworOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error al comparar'});
                            }else if(passworOk){
                                if(params.gettoken = true){
                                    res.send({token: jwt.createToken(check)});
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


function updateUser(req, res){
    var idUser = req.params.id;
    var update = req.body;

    if(idUser != req.user.sub){
        res.status(403).send({message: 'No tiene permisos para esta ruta'});
    }else{
        User.findByIdAndUpdate(idUser, update, {new: true}, (err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(userUpdated){
                res.send({message: 'Actualización éxitosa', user: userUpdated});
            }else{
                res.status(418).send({message: 'Error al actualizar al usuario'});
            }
        })
    }
}

function removeUser(req, res){
    var idUser = req.params.id;
    
    if(idUser != req.user.sub){
        res.status(403).send({message: 'No tiene permisos para esta ruta'});
    }else{
        User.findByIdAndRemove(idUser, (err, Removed)=>{
            if(err){
                res.status(500).send({message: 'Error', err})
            }else if(Removed){
                res.send({message: 'Eliminacion correcta', Removed});
            }else{
                res.status(418).send({message: 'Error al eliminar usuario'});
            }
        })
    }
}

module.exports = {
    saveUser,
    updateUser,
    removeUser,
    login
}