const express=require('express');
const rutas=express.Router();
const PeliculaModel=require('../models/Pelicula');

//endpoint traer todas las peliculas
rutas.get('/traerPeliculas',async(req,res)=>{
    try {
        const pelicula=await PeliculaModel.find();
        res.json(pelicula)
    } catch (error) {
        res.status(500).json({mensaje:error.message})
    }
})

//endpoint 2 crear peliculas
rutas.post('/crearPelicula',async(req,res)=>{
    const pelicula=new PeliculaModel({
        titulo:req.body.titulo,
        director:req.body.director,
        genero:req.body.genero,
        duracion:req.body.duracion,
        clasificacion:req.body.clasificacion,
        fecha_estreno:req.body.fecha_estreno

    })
    try {
        const nuevaPelicula=await pelicula.save();
        res.status(201).json(nuevaPelicula)
    } catch (error) {
        res.status(400).json({mensaje:error.message})
    }
})

// endpoint 3 editar
rutas.put('/editarPelicula/:id',async(req,res)=>{
    try {
        const peliculaEditada=await PeliculaModel.findByIdAndUpdate(req.params.id, req.body,{new:true})
        if (!peliculaEditada) {
            return res.status(404).json({mensaje:'Pelicula no encontrada!!!'})
        }else{
            return res.json(peliculaEditada)
        }
    } catch (error) {
        res.status(400).json({mensaje:error.message})
    }
})

//endpoint 4 eliminar
rutas.delete('/eliminarPelicula/:id',async(req,res)=>{
    try {
        const peliculaEliminada=await PeliculaModel.findByIdAndDelete(req.params.id)
        if (!peliculaEliminada) {
            return res.status(404).json({mensaje:"Pelicula no encontrada"})
        }else{
            return res.json({mensaje:"Pelicula Eliminada"})
        }
    } catch (error) {
        res.status(500).json({mensaje:error.message})
    }
})

//endpoint 5 Obtener películas por clasificación de edad
rutas.get('/peliculasPorClasificacion/:clasificacion', async (req, res) => {
    try {
        const clasificacion = req.params.clasificacion;
        const peliculas = await PeliculaModel.find({ clasificacion: clasificacion });
        
        if (peliculas.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron películas con esa clasificación' });
        } else {
            res.json(peliculas);
        }
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// endpoint 6 obtener películas por anio de estreno
rutas.get('/peliculasPorAnioEstreno/:anio', async (req, res) => {
    try {
        const anio = parseInt(req.params.anio);

        const peliculasPorAnio = await PeliculaModel.find({
            fecha_estreno: { $gte: new Date(anio, 0, 1), $lt: new Date(anio + 1, 0, 1) }
        });

        if (peliculasPorAnio.length === 0) {
            return res.status(404).json({ mensaje: `No se encontraron películas estrenadas en el año ${anio}` });
        }

        res.json(peliculasPorAnio);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// endpoint 7 eliminar películas por nombre del director
rutas.delete('/eliminarPorDirector/:director', async (req, res) => {
    try {
        const director = req.params.director;

        const resultado = await PeliculaModel.deleteMany({ director: director });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensaje: `No se encontraron películas dirigidas por ${director}` });
        }

        res.json({ mensaje: `Se eliminaron ${resultado.deletedCount} películas dirigidas por ${director}` });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// enpoint 8 peliculas por clsificacion y genero
rutas.get('/peliculasPorClasificacionYGenero/:clasificacion/:genero', async (req, res) => {
    try {
        const clasificacion = req.params.clasificacion;
        const genero = req.params.genero;
        const peliculas = await PeliculaModel.find({ clasificacion: clasificacion, genero: genero });
        
        if (peliculas.length === 0) {
            return res.status(404).json({ mensaje: `No se encontraron películas con clasificación ${clasificacion} y género ${genero}` });
        }
        
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
// end point 9 peliculas mas larga por genero
rutas.get('/peliculaMasLargaPorGenero', async (req, res) => {
    try {
        const peliculaMasLargaPorGenero = await PeliculaModel.aggregate([
            { $group: { _id: "$genero", maxDuracion: { $max: "$duracion" }, titulo: { $first: "$titulo" } } }
        ]);

        res.json(peliculaMasLargaPorGenero);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = rutas;