const {response, request} = require("express");
const Almacen = require('../models/almacen');


const warehousesGet = async (req = request, res = response) => {

    // Para las peticiones con esto  ?q=hola&nombre=josu&apikey=8212&page=3&limite=10
    // Asigno page 1 por defecto en caso de que no manden ese argumento
    // const {nombre, apikey, page = 1, limit} = req.query;

    // Puedo mandar el limite de pagina en el query (en la url), y si no por defecto es 15 url?limite=15
    const {
        limite = 15, desde = 0
    } = req.query;
    const query = {
        estado: true
    };
    // con number lo convertimos porque viene en string
    // le ponemos que solo me traiga los que no esten borrados osea que tengan el estado true
    // const usuarios = await Usuario.find({estado: true})
    // .skip(Number(desde))
    // .limit(Number(limite));

    // const total = Usuario.countDocuments({estado: true});

    // En lugar de lo anterior de está manera las 2 promesas se ejecutan al mismo tiempo y hasta que esten las 2 estén se continua con lo demás
    const [total, almacenes] = await Promise.all([
        Almacen.countDocuments(query),
        Almacen.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        ok: true,
        total,
        almacenes
    });
}

const getWarehouseById = async (req, res = response) => {
    // En el params viene como id pero yo quiero que la variable sea _id para con findOne buscarlo en la DB
    const {
        id
    } = req.params;

    const almacen = await Almacen.findById(id);

    res.json({
        ok: true,
        almacen
    })

}

const warehousePost = async (req, res = response) => {

    let {nombre, alias} = req.body;
    nombre = nombre.toUpperCase().trim()
    if (alias)
        alias = alias.toLowerCase().trim()
    const AlmacenDB = await Almacen.find({nombre, estado: true});
    if(AlmacenDB.length > 0){
        return res.status(400).json({
            ok: false,
            msg: `El almacen ${nombre} ya existe`
        })
    }
    const AlmacenAbvDB = await Almacen.find({alias, estado: true});
    if(AlmacenAbvDB.length > 0){
        return res.status(400).json({
            ok: false,
            msg: `El alias ${alias} ya existe`
        })
    }
    const almacen = new Almacen({nombre, alias});


    await almacen.save();
    res.json({
        ok: true,
        almacen
    });
}

const warehousePatch = async (req, res = response) => {
    // Esto para cuando los parametros se los ponemos directos en la ruta
    const {id} = req.params;
    let {_id, ...resto} = req.body;
    if (resto.nombre)
        resto.nombre = resto.nombre.toUpperCase().trim()
    if (resto.alias)
        resto.alias = resto.alias.toLowerCase().trim()
    const AlmacenDB = await Almacen.find({
        $and: [ { "_id": { $ne: id } }, { nombre: resto.nombre}, { estado: true } ]
    });
    if(AlmacenDB.length > 0){
        return res.status(400).json({
            ok: false,
            msg: `El almacen ${resto.nombre} ya existe`
        })
    }

    const AlmacenAbvDB = await Almacen.find({
        $and: [ { "_id": { $ne: id } }, { alias: resto.alias}, { estado: true } ]
    });
    if(AlmacenAbvDB.length > 0){
        return res.status(400).json({
            ok: false,
            msg: `El alias ${resto.alias} ya existe`
        })
    }

    const almacen = await Almacen.findByIdAndUpdate(id, resto);

    res.json({
        ok: true,
        almacen
    });
}

const warehouseDelete = async (req, res = response) => {

    const {id} = req.params;

    // Borrarlo fisicamente
    // const almacen = await Usuario.findByIdAndDelete(id);

    // Borrarlo solo para la vista
    const almacen = await Almacen.findByIdAndUpdate(id, {estado: false});

    res.json({
        ok: true,
        almacen
    });
}

module.exports = {
    warehousesGet,
    getWarehouseById,
    warehousePost,
    warehousePatch,
    warehouseDelete
}