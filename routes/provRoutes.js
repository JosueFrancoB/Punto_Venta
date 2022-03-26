const {Router} = require('express');
const {check} = require('express-validator');

// const {validarCampos} = require('../middlewares/validar-campos');
// const {validarJWT} = require('../middlewares/validar-jwt');
// const {esAdminRole, tieneRole} = require('../middlewares/validar-roles');
// Se optimizó el código anterior en el index.js de middlewares
const {
    validarCampos,
    validarJWT,
    esAdminRole
} = require('../middlewares')

const {emailExiste, existeProveedorPorId, telefonoUnico, validarRFC} = require('../helpers/db-validators');

const {
    provGet,  getProveedorPorID, provPost, provPatch, provDelete
} = require('../controllers/provCtrl');

const router = Router();

// Solo los dejo con la / porque en el server ya le estoy asignando su ruta
router.get('/', provGet);

// Obtener un proveedor por id - servicio publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProveedorPorId),
    validarCampos
], getProveedorPorID);


router.patch('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProveedorPorId),
    validarCampos
], provPatch);
// Los middleware se mandan en el 2 argumento cuando se quieren agregar y si son varios se mandan con un arreglo
// en este caso se usan para que validen todos los campos antes de hacer el método post
router.post('/', [
    check('nombre_contacto', 'El nombre de contacto es obligatorio').not().isEmpty(),
    check('nombre_empresa', 'El nombre de la empresa es obligatoria').not().isEmpty(),
    check('telefonos.*', 'El teléfono no es válido').isMobilePhone(),
    check('telefonos.*').custom(t => telefonoUnico(t,"prov")),
    check('correos.*', 'El correo no es válido').isEmail(),
    check('correos.*').custom(c => emailExiste(c,"prov")),
    check('rfc').custom(validarRFC),
    validarCampos
], provPost); 

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProveedorPorId),
    validarCampos
], provDelete)


module.exports = router;