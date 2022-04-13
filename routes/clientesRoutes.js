const {Router} = require('express');
const {check} = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole
} = require('../middlewares');

const {emailExiste, existeClientePorId, telefonoUnico} = require('../helpers/db-validators');

const {
    clientsGet,  getClientePorID, clientsPost, clientsPatch, clientsDelete
} = require('../controllers/customersCtrl');

const router = Router();

// Solo los dejo con la / porque en el server ya le estoy asignando su ruta
router.get('/', clientsGet);

// Obtener un proveedor por id - servicio publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeClientePorId),
    validarCampos
], getClientePorID);


router.patch('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeClientePorId),
    validarCampos
], clientsPatch);
// Los middleware se mandan en el 2 argumento cuando se quieren agregar y si son varios se mandan con un arreglo
// en este caso se usan para que validen todos los campos antes de hacer el método post
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre_empresa', 'El nombre de la empresa es obligatoria').not().isEmpty(),
    check('telefonos.*', 'El teléfono no es válido').isMobilePhone(),
    check('telefonos.*').custom(t => telefonoUnico(t,"cli")),
    check('correos.*', 'El correo no es válido').isEmail(),
    check('correos.*').custom(c => emailExiste(c,"cli")),
    validarCampos
], clientsPost); 

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeClientePorId),
    validarCampos
], clientsDelete)


module.exports = router;