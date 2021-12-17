const {Router} = require('express');
const {check} = require('express-validator');

// const {validarCampos} = require('../middlewares/validar-campos');
// const {validarJWT} = require('../middlewares/validar-jwt');
// const {esAdminRole, tieneRole} = require('../middlewares/validar-roles');
// Se optimizó el código anterior en el index.js de middlewares
const {
    validarCampos,
    validarJWT,
    validarRFC,
    esAdminRole
} = require('../middlewares')

const {emailExiste, existeProvedorPorId} = require('../helpers/db-validators');

const {
    provGet, provPost, provPut, provDelete
} = require('../controllers/provCtrl');

const router = Router();

// Solo los dejo con la / porque en el server ya le estoy asignando su ruta
router.get('/', provGet);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProvedorPorId),
    validarCampos
], provPut);
// Los middleware se mandan en el 2 argumento cuando se quieren agregar y si son varios se mandan con un arreglo
// en este caso se usan para que validen todos los campos antes de hacer el método post
router.post('/', [
    check('nombre_contacto', 'El nombre de contacto es obligatorio').not().isEmpty(),
    check('nombre_empresa', 'El nombre de la empresa es obligatoria').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty().isMobilePhone().custom((t) => telefonoUnico(t,"prov")),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom((c) => emailExiste(c,"prov")),
    check('rfc', 'El rfc no es válido').custom(validarRFC),
    validarCampos
], provPost); 

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProvedorPorId),
    validarCampos
], provDelete)


module.exports = router;