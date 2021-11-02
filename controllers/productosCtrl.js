const { response } = require("express");
const {Producto} = require("../models");


const crearProducto = async(req, res = response)=>{

    const {estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB){
        res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }

    // Generar data a guardar

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    // Status 201 algo se creó
    res.status(201).json(producto)

}

const ProductosGet = async(req, res = response)=>{
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

const getProductoPorID = async(req, res = response)=>{
    // En el params viene como id pero yo quiero que la variable sea _id para con findOne buscarlo en la DB
    const {id} = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    
    res.json(producto);

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

    res.json(producto);
}

const deleteProducto  = async(req, res = response)=>{
    const {id} = req.params;
    // new en true para que me regrese la Producto después de actualizarse
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        productoBorrado
    });
}

module.exports = {
    crearProducto,
    ProductosGet,
    getProductoPorID,
    updateProducto,
    deleteProducto
}