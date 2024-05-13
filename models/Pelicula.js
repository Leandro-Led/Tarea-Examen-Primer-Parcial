const mongoose =require('mongoose')
//definir el esquema
const peliculaSchema=new mongoose.Schema({
    titulo:String,
    director:String,
    genero:String,
    duracion:Number,
    clasificacion:String,
    fecha_estreno:Date
});

const PelicualaModel=mongoose.model('Pelicula',peliculaSchema,'pelicula');
module.exports=PelicualaModel;