const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario'); //Esquema/modelo
const app = express();

app.post('/login', (req, res) => {
    //en el body se alamcenan los parametros que el usuario envia en las peticiones
    let body = req.body;
    //regresar solo uno
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //evaluar usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos!'
                }
            });

        }

        //evaluar contraseña
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos!'
                }
            });

        }
        //token
        //expira en una hora: solo poner 60*60
        let token = jwt.sign({
            //payload todo el usuario de la base de datos
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
});

module.exports =
    app;