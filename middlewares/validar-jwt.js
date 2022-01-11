const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async(req = request, res = response, next)=>{

    // Quiero leer un header personalizado que yo especifico en la url
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            // msg: 'No hay token en la peticion'
            msg: 'El usuario no está autenticado'
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario= await Usuario.findById(uid);

        if(!usuario){
            //EL usuario no existe
            return res.status(401).json({
                msg: 'Token no válido'
            })
        }

        // Verificar si el usuario tiene estado true
        if(usuario.deleted || !usuario.estado){
            return res.status(401).json({
                msg: 'Token no válido'
            })
        }

        req.usuario  = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no válido'
        })
    }
}


module.exports = {
    validarJWT
};