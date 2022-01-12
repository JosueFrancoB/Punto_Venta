const {response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response)=>{

    const {correo, password} = req.body;

    try {
        // verifica si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        // Si el usuario no está borrado esta con estado true
        if(!usuario.estado){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no está habilitado'
            });
        }

        // Verificar contraseña
        // comparo la contraseña que manda el usuario con la de la base de datos
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es incorrecta'
            });
        }

        // Generar un JWT JsonWebToken
        const token = await generarJWT(usuario.id); 
        const {rol, estado, google, nombre, correo: correo2, _id: uid} = usuario
        res.json({
            rol,
            estado, 
            google, 
            nombre,
            correo: correo2,
            uid,
            token,
	        ok: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
    	    ok: false,
            msg: 'Ocurrió un error'
        })
    }
}


const googleSignIn = async(req = request, res = response, )=>{
    
    const {id_token} = req.body;
    try {
        const {nombre, img, correo} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            const data = {
                nombre,
                correo,
                password: ':)',
                img,
                google: true
                
            }
            usuario = new Usuario(data);
            await usuario.save();
        }

        if(!usuario.estado){
            res.status(401).json({
                ok: false,
                msg: 'Hable con el admin, usuario bloqueado'
            })
        }

        // Generar un JWT JsonWebToken
        const token = await generarJWT(usuario.id); 
        
        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no es válido'
        })
    }
    
    
}

const revalidarToken = async(req, res = response)=>{
    const {_id: uid, nombre} = req.usuario
    const token = await generarJWT(uid); 
    return res.status(200).json({
        ok: true,
        uid,
        nombre,
        token
    })

}

module.exports = {
    login,
    googleSignIn,
    revalidarToken
}