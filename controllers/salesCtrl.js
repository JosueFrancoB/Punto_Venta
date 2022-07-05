const {response, request} = require('express');
const mongoose = require('mongoose');

const Venta = require('../models/venta');
const Producto = require('../models/producto');
const {init_collections, most_selled_products, best_clients, best_employees} = require('../controllers/statisticsCtrl')
const {convertArrayInObjectsArray, diacriticInsensitiveRegExp, escapeStringRegexp} = require('../helpers/busqueda')

const isValidJson = (json)  =>{
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
};

const getSales = async (req, res) => {
    const all_fields = JSON.stringify(["codigo", 'usuario_venta.nombre', 'cliente.nombre'])
    let {limite = 10, desde = 0, search  = "" , search_fields = all_fields, estado = true} = req.query;

    if(!isValidJson(search_fields)){
        return res.status(400).json({ param: "search_fields",
        location: "params" ,
        msg :"invalid search_fields is not json valid"  ,
        msg_es:`la variable search_fields debe de ser un json` });
    }

    if (search_fields === '["all"]')
        search_fields = all_fields
    search_fields = JSON.parse(search_fields);

    if (!Array.isArray(search_fields)) {
        search_fields = [search_fields];
    }

    search = await diacriticInsensitiveRegExp(escapeStringRegexp(search));
    const expresion = new RegExp(search, "i");
    const search_in = await convertArrayInObjectsArray(
        search_fields,
        expresion
    );

    let query = {
        $and: [{ estado }],
        $or: search_in,
    };

    const [total, ventas] = await Promise.all([
        Venta.countDocuments(query),
        Venta.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    return res.status(200).json({
        ok: true,
        total,
        ventas
    });
};

const getSaleById = async (req, res) => {

    const {id} = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if(!isValidId){
        return res.status(400).json({
            ok: false,
            msg: 'MongoID no válido',
            msg_es: 'Invalid MongoID'
        });
    }

    const venta = await Venta.findById(id);
    if(!venta){
        return res.json({
            ok: false,
            msg: 'No se encontró la venta',
            msg_es: "Sale not found"
        });
    }

    return res.status(200).json({
        ok: true,
        venta
    });
}

const createSale = async (req, res) => {
    let {estado, codigo, fecha, cancelada, ...body} = req.body;
    
    //Date
    fecha = new Date();

    //Generar codigo de venta
    codigo =  await Venta.countDocuments({});
    codigo = `${codigo+1}${fecha.getFullYear()}${fecha.getMonth()}${fecha.getDate()}`;

    //Generar data a guardar
    const data = {
        ...body,
        codigo,
        fecha,
        estado: true,
        cancelada: false
    };

    try{
        // Reducir stock de productos
        reduceFromStock(data.productos);
        let productos = []
        data.productos.forEach(product => {
            productos.push({nombre: product.nombre, cantidad: product.cantidad})
        });
        let empleados = [{nombre: data.usuario_venta.nombre, dinero_ventas: data.total_a_pagar}]

        let date = fecha.getFullYear() + '-'
        + ('0' + (fecha.getMonth()+1)).slice(-2) + '-'
        + ('0' + fecha.getDate()).slice(-2);

        const venta = new Venta(data);
        await venta.save();

        await init_collections(date, 'day')
        await init_collections(date, 'week')
        await init_collections(date, 'month')
        await init_collections(date, 'year')

        most_selled_products(productos, date, 'day')
        most_selled_products(productos, date, 'week')
        most_selled_products(productos, date, 'month')
        most_selled_products(productos, date, 'year')

        best_employees(empleados, date, 'day')
        best_employees(empleados, date, 'week')
        best_employees(empleados, date, 'month')
        best_employees(empleados, date, 'year')
        
        if (data.cliente){
            let clientes = [{nombre: data.cliente.nombre, nombre_empresa: data.cliente.nombre_empresa, dinero_compras: data.total_a_pagar}]
            best_clients(clientes, date, 'day')
            best_clients(clientes, date, 'week')
            best_clients(clientes, date, 'month')
            best_clients(clientes, date, 'year')
        }
        return res.status(201).json({
            ok: true,
            venta
        });
    }
    catch(error){
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear la venta',
            msg_es: 'Error creating sale',
            error: error.message
        });
    }

};

const updateSale = async (req, res) => {

    const {id} = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if(!isValidId){
        return res.status(400).json({
            ok: false,
            msg: 'MongoID no válido',
            msg_es: 'Invalid MongoID'
        });
    }

    const {estado, cancelada, ...body} = req.body;
    try{
        const venta_actualizada = await Venta.findByIdAndUpdate(id, body, {new: true});

        res.status(200).json({
            ok: true,
            venta_actualizada
        });
    }catch(error){
        res.status(400).json({
            ok: false,
            msg: 'Error al actualizar la venta',
            msg_es: 'Error updating sale',
            error: error.message
        });
    }
};

const deleteSale = async (req, res) => {

    const {id} = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if(!isValidId){
        return res.status(400).json({
            ok: false,
            msg: 'MongoID no válido',
            msg_es: 'Invalid MongoID'
        });
    }

    try{
        const venta_eliminada = await Venta.findByIdAndUpdate(id, {estado: false}, {new: true});

        res.status(200).json({
            ok: true,
            venta_eliminada
        });

    }catch(error){
        res.status(400).json({
            ok: false,
            msg: 'Error al eliminar la venta',
            msg_es: 'Error deleting sale',
            error: error.message
        });
    }
};

const cancelSale = async (req, res) => {

    const {id} = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if(!isValidId){
        return res.status(400).json({
            ok: false,
            msg: 'MongoID no válido',
            msg_es: 'Invalid MongoID'
        });
    }

    try{
        const venta_cancelada = await Venta.findByIdAndUpdate(id, {cancelada: true}, {new: true});

        res.status(200).json({
            ok: true,
            venta_cancelada
        });

    }catch(error){
        res.status(400).json({
            ok: false,
            msg: 'Error al cancelar la venta',
            msg_es: 'Error canceling sale',
            error: error.message
        });
    }
    
};

const reduceFromStock = async (products) => {
    products.forEach(async (product) => {
        const {existencias} = await Producto.findById(product._id);
        let new_stock = 0;
        if (existencias - product.cantidad > 0) new_stock = existencias - product.cantidad;
        
        await Producto.findByIdAndUpdate(product._id, {existencias: new_stock});
    });
};  

module.exports = {
    getSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
    cancelSale
};