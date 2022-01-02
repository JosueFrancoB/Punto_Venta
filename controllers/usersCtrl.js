const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');

// Se les igualo req = request para que me aparezcan las opciones y ayudas de vscode
const usersGet = async(req = request, res = response) =>{

    // Para las peticiones con esto  ?q=hola&nombre=josu&apikey=8212&page=3&limite=10
    // Asigno page 1 por defecto en caso de que no manden ese argumento
    // const {nombre, apikey, page = 1, limit} = req.query;

    // Puedo mandar el limite de pagina en el query (en la url), y si no por defecto es 5 url?limite=5
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};
    // con number lo convertimos porque viene en string
    // le ponemos que solo me traiga los que no esten borrados osea que tengan el estado true
    // const usuarios = await Usuario.find({estado: true})
    // .skip(Number(desde))
    // .limit(Number(limite));

    // const total = Usuario.countDocuments({estado: true});

    // En lugar de lo anterior de está manera las 2 promesas se ejecutan al mismo tiempo y hasta que esten las 2 estén se continua con lo demás
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const getUserById = async(req, res = response)=>{
    // En el params viene como id pero yo quiero que la variable sea _id para con findOne buscarlo en la DB
    const {id} = req.params;

    const usuario = await Usuario.findById(id);
    
    res.json(usuario);

}
const usersPost = async(req, res = response) =>{

    let {nombre, correo, password, rol} = req.body;
    if (!rol){
        rol = 'USER_ROLE'
    }
    const usuario = new Usuario({nombre, correo, password, rol});

    

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    const token = await generarJWT(usuario.id); 
    await usuario.save();
    
    const {rol: u_rol, estado, google, nombre: name, correo: mail, uid} = usuario
    res.json({
        rol: u_rol,
        estado,
        google, 
        nombre: name, 
        correo: mail, 
        uid,
        token,
        ok: true
    });
}

const usersPut = async(req, res = response) =>{
    // Esto para cuando los parametros se los ponemos directos en la ruta
    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    if(password){
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usersDelete = async(req, res = response) =>{

    const {id} = req.params;

    // Borrarlo fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Borrarlo solo para la vista
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    const usuarioAutenticado = req.usuario; 


    res.json({
        usuario, usuarioAutenticado
    });
}




module.exports = {
    usersGet,
    getUserById,
    usersPost,
    usersPut,
    usersDelete
}