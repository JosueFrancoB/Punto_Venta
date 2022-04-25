const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Proveedor = require('../models/proveedor');

// Se les igualo req = request para que me aparezcan las opciones y ayudas de vscode
const provGet = async(req = request, res = response) =>{

    // Para las peticiones con esto  ?q=hola&nombre=josu&apikey=8212&page=3&limite=10
    // Asigno page 1 por defecto en caso de que no manden ese argumento
    // const {nombre, apikey, page = 1, limit} = req.query;

    // Puedo mandar el limite de pagina en el query (en la url), y si no por defecto es 5 url?limite=5
    const {limite = 15, desde = 0} = req.query;
    const query = {estado: true};
    // con number lo convertimos porque viene en string
    // le ponemos que solo me traiga los que no esten borrados osea que tengan el estado true
    // const usuarios = await Usuario.find({estado: true})
    // .skip(Number(desde))
    // .limit(Number(limite));

    // const total = Usuario.countDocuments({estado: true});

    // En lugar de lo anterior de está manera las 2 promesas se ejecutan al mismo tiempo y hasta que esten las 2 estén se continua con lo demás
    const [total, proveedores] = await Promise.all([
        Proveedor.countDocuments(query),
        Proveedor.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        ok: true,
        total,
        proveedores
    });
}

const getProveedorPorID = async(req, res = response)=>{
    // En el params viene como id pero yo quiero que la variable sea _id para con findOne buscarlo en la DB
    const {id} = req.params;

    const proveedor = await Proveedor.findById(id);
    
    res.json({
        ok:true,
        proveedor,
    })

}

const provPost = async(req, res = response) =>{

    const {nombre_contacto, nombre_empresa, telefonos, correos, rfc, direcciones} = req.body;
    const proveedor = new Proveedor({nombre_contacto, nombre_empresa, telefonos, correos, rfc, direcciones});

    const proveedorDB = await Proveedor.find({rfc, estado: true});
    if(proveedorDB.length > 0){
        return res.status(400).json({
            ok: false,
            msg: `El rfc ${rfc} ya está registrado`
        })
    }

    await proveedor.save();
    res.json({
        ok: true,
        proveedor
    });
}

const provPatch = async(req, res = response) =>{
    // Esto para cuando los parametros se los ponemos directos en la ruta
    const {id} = req.params;
    const {_id, ...resto} = req.body;

    const proveedorDB = await Proveedor.find({rfc: resto.rfc, estado: true});
    if(proveedorDB.length > 0){
        return res.status(400).json({
            ok: false,
            msg: `El rfc ${resto.rfc} ya está registrado`
        })
    }

    const proveedor = await Proveedor.findByIdAndUpdate(id, resto);

    res.json({
        ok: true,
        proveedor
    });
}

const provDelete = async(req, res = response) =>{

    const {id} = req.params;

    // Borrarlo fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Borrarlo solo para la vista
    const proveedor = await Proveedor.findByIdAndUpdate(id, {estado: false});

    res.json({
        ok: true,
        proveedor
    });
}




module.exports = {
    provGet,
    getProveedorPorID,
    provPost,
    provPatch,
    provDelete
}