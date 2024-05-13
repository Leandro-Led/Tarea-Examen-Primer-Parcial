//importacion de librerias
const express=require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const app=express();
//ruta
const peliculaRutas=require('./rutas/peliculaRutas');

//configuraciones de enviroment
const PORT=process.env.PORT || 3000;
const MONGO_URI=process.env.MONGO_URI;
//manejo de json
app.use(express.json());

//conexion con MONGODB
mongoose.connect(MONGO_URI).then(
    ()=>{
        console.log('Conexion Exitosa');
        app.listen(PORT,()=>{console.log("Servidor Express corriendo en el puerto: "+PORT)})
    }
).catch(error=> console.log('error de conexion',error));

//utlizar la rutas de peliculas
app.use('/cartelera',peliculaRutas);