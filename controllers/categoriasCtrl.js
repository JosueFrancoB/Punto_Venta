const { response } = require("express");
const {Categoria} = require("../models");


const crearCategoria = async(req, res = response)=>{
    
    const nombre = req.body.nombre.toUpperCase();

    //TODO: Arreglar que solo compruebe el usuario repetido si no esta eliminado estado: true
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        res.status(400).json({
            ok: false,
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        })
    }
    const { img = '', estado } = req.body;
    
    // Generar data a guardar
    const data = {
        nombre,
        img,
        estado
    }

    const categoria = new Categoria(data);

    // Guardar DB
    await categoria.save();

    // Status 201 algo se creó
    res.status(201).json({
        ok: true,
        categoria
    })

}

const categoriasGet = async(req, res = response)=>{
    const {limite = 10, desde = 0} = req.query;
    const query = {estado: true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        ok: true,
        total,
        categorias
    });
}

const getCategoriaPorID = async(req, res = response)=>{
    // En el params viene como id pero yo quiero que la variable sea _id para con findOne buscarlo en la DB
    const {id} = req.params;

    const categoria = await Categoria.findById(id);
    
    res.json({
        ok:true,
        categoria,
        // categoria
    })

}

const updateCategoria = async(req, res = response)=>{
    const {id} = req.params;
    const { estado, ...data } = req.body;
    console.log('la data', data);
    data.nombre = data.nombre.toUpperCase()
    // data.nombre = data.nombre.toUpperCase();
    // data.usuario = req.usuario._id;
    // lo de new: true nada más es para que en la variable categoria se guarde ya actualizado y verlo en la respuesta
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({
        ok: true,
        categoria
    });
}

const deleteCategoria  = async(req, res = response)=>{
    const {id} = req.params;
    // new en true para que me regrese la categoria después de actualizarse
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        ok: true,
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