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
} = require('../middlewares');

const {emailExiste, existeProveedorPorId, telefonoUnico, validarRFC} = require('../helpers/db-validators');

const {
    provGet,  getProveedorPorID, provPost, provPatch, provDelete
} = require('../controllers/suppliersCtrl');

const router = Router();

router.get('/', provGet);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProveedorPorId),
    validarCampos
], getProveedorPorID);


router.patch('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProveedorPorId),
    check('rfc').custom(validarRFC),
    validarCampos
], provPatch);


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
], provDelete);


module.exports = router;