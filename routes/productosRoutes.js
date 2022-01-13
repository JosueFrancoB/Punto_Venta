const {Router} = require('express');
const {check} = require('express-validator');
const { crearProducto, ProductosGet, getProductoPorID, getProductosPorCategoria, updateProducto, deleteProducto } = require('../controllers/productosCtrl');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

// Obtener todas las Productos - servicio publico
router.get('/', ProductosGet);

// Obtener una Producto por id - servicio publico
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], getProductoPorID);

// Obtener una Producto por id de categoria- servicio publico
router.get('/categoria/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], getProductosPorCategoria);

// Crear una Producto - privado cualquier persona con token válido
router.post('/', [
    // validarJWT,
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('categoria', 'No es un id válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar - privado cualquier persona con token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], updateProducto);

// Borrar categoría - privado solo si es admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], deleteProducto);

module.exports = router;