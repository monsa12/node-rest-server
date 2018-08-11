const express = require('express');
const fs = require('fs');
let app = express();
const path = require('path');

const { verificaToken, verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/noimg.png');
        res.sendFile(noImagePath);
    }




});





module.exports = app;