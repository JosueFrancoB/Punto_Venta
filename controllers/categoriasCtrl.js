const { response } = require("express");
const {Categoria} = require("../models");


const crearCategoria = async(req, res = response)=>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        })
    }

    // Generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // Guardar DB
    await categoria.save();

    // Status 201 algo se creó
    res.status(201).json(categoria)

}

const categoriasGet = async(req, res = response)=>{
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

const getCategoriaPorID = async(req, res = response)=>{
    // En el params viene como id pero yo quiero que la variable sea _id para con findOne buscarlo en la DB
    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    
    res.json({
        categoria,
        // categoria
    })

}

const updateCategoria = async(req, res = response)=>{
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    // lo de new: true nada más es para que en la variable categoria se guarde ya actualizado y verlo en la respuesta
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json(categoria);
}

const deleteCategoria  = async(req, res = response)=>{
    const {id} = req.params;
    // new en true para que me regrese la categoria después de actualizarse
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        categoriaBorrada
    });
}

module.exports = {
    crearCategoria,
    categoriasGet,
    getCategoriaPorID,
    updateCategoria,
    deleteCategoria
}