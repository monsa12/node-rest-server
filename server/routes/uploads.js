const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hya ninugn archivo seleccionado'

            }
        });
    }


    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),

            }
        })

    }


    let archivo = req.files.archivo;

    // Extensiones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    let cortarNombre = archivo.name.split('.');
    let extensionArchivo = cortarNombre[cortarNombre.length - 1]

    if (extencionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son: ' + extencionesValidas.join(', '),
                extencion: extensionArchivo
            }
        })
    }


    //Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        //Aqui la imagen ya se ha guardado
        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }



    });
});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            //el archivo ya esta subido, si ocurre un error se debe eliminar tambie
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).join({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        //Actualizar imagen y borrar la anterior
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                Usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    })

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            //el archivo ya esta subido, si ocurre un error se debe eliminar tambie
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).join({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).join({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        //Actualizar imagen y borrar la anterior
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });

    })

}


function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);

    }
}
module.exports = app;