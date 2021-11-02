const { validationResult } = require('express-validator');

// El parametro next lo voy a utilizar si el middleware pasó y todo está bien, va pasando al siguiente check que esta en las rutas,
// y si pasa todos los check el next sigue con la ejecución del controller
const validarCampos = (req, res, next)=>{
    const errors = validationResult(req);

    // si hay errores
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    validarCampos
}