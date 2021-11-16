const validaCampos = require('../middlewares/validar-campos');
const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validaArchivo = require('../middlewares/validar-archivo');
const validarRFC = require('../middlewares/validar-rfc');


module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validaArchivo,
    ...validarRFC
}