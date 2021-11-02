const {Router} = require('express');
const {check} = require('express-validator');

// const {validarCampos} = require('../middlewares/validar-campos');
// const {validarJWT} = require('../middlewares/validar-jwt');
// const {esAdminRole, tieneRole} = require('../middlewares/validar-roles');
// Se optimizó el código anterior en el index.js de middlewares
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares')

const {esRoleValido, emailExiste, existeUserPorId} = require('../helpers/db-validators');

const {
    usersGet, usersPost, usersPut, usersDelete
} = require('../controllers/usersCtrl');

const router = Router();

// Solo los dejo con la / porque en el server ya le estoy asignando su ruta
router.get('/', usersGet);

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUserPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usersPut);
// Los middleware se mandan en el 2 argumento cuando se quieren agregar y si son varios se mandan con un arreglo
// en este caso se usan para que validen todos los campos antes de hacer el método post
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usersPost); 

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUserPorId),
    validarCampos
], usersDelete)


module.exports = router;