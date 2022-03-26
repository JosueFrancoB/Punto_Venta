// External libreries
const { Router } = require('express');
const { check } = require('express-validator'); 

// Internal requirements (functions)
const { validarCampos, validarJWT } = require('../middlewares');
const { get_cities, get_states, get_countries, unitsGet, getUnitPorID, unitsPost, unitsPatch, unitsDelete} = require('../controllers/attributesCtrl');
const { exists_state_by_id, validator_state, exists_country_by_id, validator_country,  exists_unit_by_id } = require('../helpers/valid-attributes');

const router = Router();

/* {{url}}/cities */
// Get cities by state - private
router.get('/city/:state_id',[
    validarJWT,
    check('state_id', { msg: 'Mongo id is not valid', msg_es: 'No es un id de Mongo válido'}).isMongoId(),
    validarCampos,
    check('state_id').custom( exists_state_by_id ),
    validarCampos,
    validator_state
], get_cities );

/* {{url}}/states */
// Get states by country - private
router.get('/state/:country_id',[
    validarJWT,
    check('country_id', { msg: 'Mongo id is not valid', msg_es: 'No es un id de Mongo válido'}).isMongoId(),
    validarCampos,
    check('country_id').custom( exists_country_by_id ),
    validarCampos,
    validator_country
], get_states);

// Get countries
router.get('/countries', [
    validarJWT
], get_countries );


/* {{url}}/units */
// Create unit - private
router.post('/unit', [ 
    validarJWT,
    check('name', { msg: 'Unit name is required', msg_es: 'El nombre de la unidad es obligatorio'}).not().isEmpty(),
    validarCampos
], unitsPost );

// Get units - private
router.get('/units', [
    validarJWT
], unitsGet );

// Get unit by id - private
router.get('/units/:id', [
    validarJWT,
    check('id', { msg: 'Mongo id is not valid', msg_es: 'No es un id de Mongo válido' }).isMongoId(),
    validarCampos,
    check('id').custom( exists_unit_by_id ),
    validarCampos
], getUnitPorID );

// Update unit by id - private
router.patch('/unit/:id', [
    validarJWT,
    check('id', { msg: 'Mongo id is not valid', msg_es: 'No es un id de Mongo válido' }).isMongoId(),
    validarCampos,
    check('id').custom( exists_unit_by_id ),
    validarCampos
], unitsPatch );

// Delete unit by id - private
router.delete('/unit/:id', [
    validarJWT,
    check('id', { msg: 'Mongo id is not valid', msg_es: 'No es un id de Mongo válido' }).isMongoId(),
    validarCampos,
    check('id').custom( exists_unit_by_id ),
    validarCampos
], unitsDelete );

// Routes export
module.exports = router;