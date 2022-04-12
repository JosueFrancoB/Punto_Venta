const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Cliente = require('../models/cliente');

// Se les igualo req = request para que me aparezcan las opciones y ayudas de vscode
const clientsGet = async(req = request, res = response) =>{

    // Para las peticiones con esto  ?q=hola&nombre=josu&apikey=8212&page=3&limite=10
    // Asigno page 1 por defecto en caso de que no manden ese argumento
    // const {nombre, apikey, page = 1, limit} = req.query;

    // Puedo mandar el limite de pagina en el query (en la url), y si no por defecto es 15 url?limite=15
    const {limite = 15, desde = 0} = req.query;
    const query = {estado: true};
    // con number lo convertimos porque viene en string
    // le ponemos que solo me traiga los que no esten borrados osea que tengan el estado true
    // const usuarios = await Usuario.find({estado: true})
    // .skip(Number(desde))
    // .limit(Number(limite));

    // const total = Usuario.countDocuments({estado: true});

    // En lugar de lo anterior de está manera las 2 promesas se ejecutan al mismo tiempo y hasta que esten las 2 estén se continua con lo demás
    const [total, clientes] = await Promise.all([
        Cliente.countDocuments(query),
        Cliente.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        ok: true,
        total,
        clientes
    });
}

const getClientePorID = async(req, res = response)=>{
    // En el params viene como id pero yo quiero que la variable sea _id para con findOne buscarlo en la DB
    const {id} = req.params;

    const cliente = await Cliente.findById(id);
    
    res.json({
        ok:true,
        cliente,
    })

}

const clientsPost = async(req, res = response) =>{

    console.log('Entre clients Post');
    console.log(req.body);
    const {nombre, nombre_empresa, telefonos, correos, direcciones} = req.body;
    const cliente = new Cliente({nombre, nombre_empresa, telefonos, correos, direcciones});


    await cliente.save();
    res.json({
        ok: true,
        cliente
    });
}

const clientsPatch = async(req, res = response) =>{
    // Esto para cuando los parametros se los ponemos directos en la ruta
    const {id} = req.params;
    const {_id, ...resto} = req.body;

    const cliente = await Cliente.findByIdAndUpdate(id, resto);

    res.json({
        ok: true,
        cliente
    });
}

const clientsDelete = async(req, res = response) =>{

    const {id} = req.params;

    // Borrarlo fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Borrarlo solo para la vista
    const cliente = await Cliente.findByIdAndUpdate(id, {estado: false});

    res.json({
        ok: true,
        cliente
    });
}




module.exports = {
    clientsGet,
    getClientePorID,
    clientsPost,
    clientsPatch,
    clientsDelete
}