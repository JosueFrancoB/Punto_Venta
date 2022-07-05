const {Router} = require('express');
const {check} = require('express-validator');
const {coleccionesPermitidas, stadisticasPermitidas} = require('../helpers');
const { validarJWT, validarCampos} = require('../middlewares');
const {get_statistics} = require('../controllers/statisticsCtrl')

const router = Router();

router.get('/:stat/:date_key/:date', [
    validarJWT,
    check('stat').custom(c => stadisticasPermitidas(c, ['all', 'most_selled_products', 'rich_clients', 'frecuency_clients', 'seller_employees', 'money_employees'])),
    check('date_key').custom(c => coleccionesPermitidas(c, ['day', 'week', 'month', 'year'])),
    validarCampos
], get_statistics);

module.exports = router;