//
//Puerto
//
process.env.PORT = process.env.PORT || 3000;

//
//Entorno
//
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//
//vencimiento del token
//60 segundo
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



//
//SEED semilla de autenticacion
//se crea la variable glogal con heroku cli
//heroku config:set SEED="este-es-el-seed-de-produccion"
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//
//Base de datos
//
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URLDB;
}

process.env.URLDB = urlDB;