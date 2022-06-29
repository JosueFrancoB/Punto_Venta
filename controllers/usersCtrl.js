const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');


const usersGet = async(req = request, res = response) =>{

    const {limite = 10, desde = 0} = req.query;
    const query = {deleted: false};

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios,
        ok: true
    });
}

const getUserById = async(req, res = response)=>{
    // En el params viene como id pero yo quiero que la variable sea _id para con findOne buscarlo en la DB
    const {id} = req.params;

    const usuario = await Usuario.findById(id, {deleted: false});
    
    res.json({usuario, ok: true});

}
const usersPost = async(req, res = response) =>{

    let {nombre, correo, password, rol, img = ''} = req.body;
    if (!rol){
        rol = 'Usuario'
    }
    const usuario = new Usuario({nombre, correo, password, rol, img});

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    const token = await generarJWT(usuario.id); 
    await usuario.save();
    
    const {rol: u_rol, estado, google, nombre: name, img: im, correo: mail, uid} = usuario
    res.json({
        rol: u_rol,
        estado,
        google, 
        nombre: name, 
        correo: mail, 
        uid,
        img: im,
        token,
        ok: true
    });
}


const usersRegister = async(req, res = response) =>{

    let {nombre, correo, password, rol, img = ''} = req.body;
    if (!rol){
        rol = 'Usuario'
    }
    const usuario = new Usuario({nombre, correo, password, rol, img});

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    const token = await generarJWT(usuario.id); 
    await usuario.save();
    
    const {rol: u_rol, estado, google, nombre: name, img: im, correo: mail, uid} = usuario
    res.json({
        rol: u_rol,
        estado,
        google, 
        nombre: name, 
        correo: mail, 
        uid,
        img: im,
        token,
        ok: true
    });
}

const usersPut = async(req, res = response) =>{
    // Esto para cuando los parametros se los ponemos directos en la ruta
    const {id} = req.params;
    const {_id, password, google, ...resto} = req.body;

    if(password){
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({usuario, ok: true});
}

const usersDelete = async(req, res = response) =>{

    const {id} = req.params;

    // Borrarlo fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Borrarlo solo para la vista
    const usuario = await Usuario.findByIdAndUpdate(id, {deleted: true});

    const usuarioAutenticado = req.usuario; 


    res.json({
        usuario, usuarioAutenticado, ok: true
    });
}

module.exports = {
    usersGet,
    getUserById,
    usersPost,
    usersRegister,
    usersPut,
    usersDelete
}