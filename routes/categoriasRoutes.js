const {Router} = require('express');
const {check} = require('express-validator');
const { crearCategoria, categoriasGet, getCategoriaPorID, updateCategoria, deleteCategoria } = require('../controllers/categoriesCtrl');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

// Obtener todas las categorias - servicio publico
router.get('/', categoriasGet);

// Obtener una categoria por id - servicio publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], getCategoriaPorID);

// Crear una categoria - privado cualquier persona con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado cualquier persona con token válido
router.patch('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], updateCategoria);

// Borrar categoría - privado solo si es admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], deleteCategoria);

module.exports = router;