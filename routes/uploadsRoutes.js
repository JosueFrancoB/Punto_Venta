const {Router} = require('express');
const {check} = require('express-validator');
const {cargarArchivo, actualizarImagen, mostrarImagen} = require('../controllers/uploadsCtrl');
const {coleccionesPermitidas} = require('../helpers');
const {validarCampos, validarArchivoSubir} = require('../middlewares');


const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'productos'])),
    validarCampos
], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'productos'])),
    validarCampos
], mostrarImagen);

module.exports = router;