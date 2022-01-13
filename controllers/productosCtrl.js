const { response } = require("express");
const {Producto} = require("../models");


const crearProducto = async(req, res = response)=>{

    const {estado, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        res.status(400).json({
            ok: false,
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }

    // Generar data a guardar

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
    }

    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    // Status 201 algo se creó
    res.status(201).json({
        ok: true,
        producto
    })

}

const ProductosGet = async(req, res = response)=>{
    const {limite = 10, desde = 0, category = ''} = req.query;
    const query = {estado: true};
    if (category != ''){
        query.categoria = category
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        ok: true,
        total,
        productos
    });
}

const getProductoPorID = async(req, res = response)=>{
    // En el params viene como id pero yo quiero que la variable sea _id para con findOne buscarlo en la DB
    const {id} = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    
    res.json({
        ok: true,
        producto
    });

}

const getProductosPorCategoria = async(req, res = response)=>{
    const {limite = 10, desde = 0} = req.query;
    
    const {id} = req.params;

    const query = {estado: true, categoria: id};
    
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        ok: true,
        total,
        productos
    });
}

const updateProducto = async(req, res = response)=>{
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;
    // lo de new: true nada más es para que en la variable Producto se guarde ya actualizado y verlo en la respuesta
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        ok: true,
        producto
    });
}

const deleteProducto  = async(req, res = response)=>{
    const {id} = req.params;
    // new en true para que me regrese la Producto después de actualizarse
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        ok:true,
        productoBorrado
    });
}

module.exports = {
    crearProducto,
    ProductosGet,
    getProductoPorID,
    getProductosPorCategoria,
    updateProducto,
    deleteProducto
}