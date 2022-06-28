const mongoose = require('mongoose');


const Compra = require('../models/compra');
const Producto = require('../models/producto');
const {convertArrayInObjectsArray, diacriticInsensitiveRegExp, escapeStringRegexp} = require('../helpers/busqueda')

const isValidJson = (json)  =>{
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
};

const getPurchases = async (req, res) => {

    const all_fields = JSON.stringify(['usuario_compra.nombre', 'proveedor.nombre_contacto', 'proveedor.nombre_empresa'])
    let {limite = 10, desde = 0, search  = "" , search_fields = all_fields, estado = true} = req.query;

    if(!isValidJson(search_fields)){
        return res.status(400).json({ param: "search_fields",
        location: "params" ,
        msg :"invalid search_fields is not json valid"  ,
        msg_es:`la variable search_fields debe de ser un json` });
    }

    if (search_fields === '["all"]')
        search_fields = all_fields
    
    if(search_fields === '["proveedor"]'){
        search_fields = JSON.parse(all_fields).slice(1)
        console.log(search_fields)
    }else{
        search_fields = JSON.parse(search_fields);
    }
    
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
    const [total, compras] = await Promise.all([
        Compra.countDocuments(query),
        Compra.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    return res.status(200).json({
        ok: true,
        total,
        compras
    });
};


const getPurchaseById = async (req, res) => {

    const {id} = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if(!isValidId){
        return res.status(400).json({
            ok: false,
            msg: 'MongoID no válido',
            msg_es: 'Invalid MongoID'
        });
    }

    const compra = await Compra.findById(id);
    if(!compra){
        return res.json({
            ok: false,
            msg: 'No se encontró la compra',
            msg_es: "Purchase not found"
        });
    }

    return res.status(200).json({
        ok: true,
        compra
    });
};


const createPurchase = async (req, res) => {

    let {estado, fecha,  ...body} = req.body;

    fecha = new Date();

    try{
        increaseStock(body.productos);
        const data = {
            estado,
            fecha,
            ...body
        };
        const compra = new Compra(data);
        await compra.save();

        return res.status(200).json({
            ok: true,
            compra
        });

    } catch(err){
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear la compra',
            msg_es: 'Error creating purchase',
        });
    }

};


const updatePurchase = async (req, res) => {

    const {id} = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(id);

    if(!isValidId){
        return res.status(400).json({
            ok: false,
            msg: 'MongoID no válido',
            msg_es: 'Invalid MongoID'
        });
    }

    const {estado, fecha, ...body} = req.body;

    try{
        const compra = await Compra.findByIdAndUpdate(id, body, {new: true});
        if(!compra){
            return res.json({
                ok: false,
                msg: 'No se encontró la compra',
                msg_es: "Purchase not found"
            });
        }

        return res.status(200).json({
            ok: true,
            compra
        });

    } catch(err){
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar la compra',
            msg_es: 'Error updating purchase',
        });
    }
};


const deletePurchase = async (req, res) => {

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

        const compra = await Compra.findByIdAndUpdate(id, {estado: false}, {new: true});
        if(!compra){
            return res.json({
                ok: false,
                msg: 'No se encontró la compra',
                msg_es: "Purchase not found"
            });
        }

        return res.status(200).json({
            ok: true,
            compra
        });

    } catch(err){
        return res.status(400).json({
            ok: false,
            msg: 'Error al eliminar la compra',
            msg_es: 'Error deleting purchase',
        });
    }
};


const increaseStock = async (productos) => {
    productos.forEach(async (producto) => {
        const {existencias} = await Producto.findById(producto._id);
        const new_stock = existencias + (producto.cantidad * producto.factor);
        await Producto.findByIdAndUpdate(producto._id, {existencias: new_stock});
    });
};


module.exports = {
    getPurchases,
    getPurchaseById,
    createPurchase,
    updatePurchase,
    deletePurchase
};