const {Router} = require('express');
const {check} = require('express-validator');
const { crearProducto, ProductosGet, getProductoPorID, getProductosPorCategoria, updateProducto, deleteProducto } = require('../controllers/productsCtrl');
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
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('unidad_compra', 'La unidad compra es obligatoria').not().isEmpty(),
    check('unidad_venta', 'La unidad de venta es obligatoria').not().isEmpty(),
    check('precio_compra', 'El precio de compra es obligatorio').not().isEmpty(),
    check('precio_venta', 'El precio de venta es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar - privado cualquier persona con token válido
router.patch('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('unidad_compra', 'La unidad compra es obligatoria').not().isEmpty(),
    check('unidad_venta', 'La unidad de venta es obligatoria').not().isEmpty(),
    check('precio_compra', 'El precio de compra es obligatorio').not().isEmpty(),
    check('precio_venta', 'El precio de venta es obligatorio').not().isEmpty(),
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