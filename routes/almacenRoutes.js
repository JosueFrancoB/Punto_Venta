// External libreries
const {Router} = require('express');
const {check} = require('express-validator');

// Internal requirements (functions)
const {validarCampos,validarJWT} = require('../middlewares');
const {warehousesGet, getWarehouseById, warehousePost, warehousePatch, warehouseDelete} = require('../controllers/almacenCtrl');
const {exists_warehouse_by_id} = require('../helpers/valid-attributes');

const router = Router();


/* {{url}}/units */
// Create warehouse - private
router.post('/', [
    validarJWT,
    check('nombre', {
        msg: 'El nombre del almacen es obligatorio',
    }).not().isEmpty(),
    validarCampos
], warehousePost);

// Get warehouses - private
router.get('/', [
    validarJWT
], warehousesGet);

// Get warehouse by id - private
router.get('/:id', [
    validarJWT,
    check('id', {
        msg: 'No es un id de Mongo válido',
    }).isMongoId(),
    validarCampos,
    check('id').custom(exists_warehouse_by_id),
    validarCampos
], getWarehouseById);

// Update warehouse by id - private
router.patch('/:id', [
    validarJWT,
    check('id', {
        msg: 'No es un id de Mongo válido',
    }).isMongoId(),
    validarCampos,
    check('id').custom(exists_warehouse_by_id),
    validarCampos
], warehousePatch);

// Delete warehouse by id - private
router.delete('/:id', [
    validarJWT,
    check('id', {
        msg: 'No es un id de Mongo válido',
    }).isMongoId(),
    validarCampos,
    check('id').custom(exists_warehouse_by_id),
    validarCampos
], warehouseDelete);

// Routes export
module.exports = router;