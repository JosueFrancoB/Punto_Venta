const { response } = require("express")


const esAdminRole = (req = request, res = response, next)=>{
    
    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const {rol, nombre} = req.usuario;

    if(rol !== 'Administrador'){
        return res.status(401).json({
            msg: `NO ERES UN ADMINISTRADOR, NO SE TE PERMITE REALIZAR ESTA ACCIÓN`
        });
    }

    next();
}

const tieneRole = (...roles)=>{
    return (req = request, res = response, next) =>{

        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }
        
        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}