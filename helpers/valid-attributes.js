const response = require('express')

const country = require('../models/country');
const state = require('../models/state');
const unit = require('../models/unit');
const almacen = require('../models/almacen');


/* Country validator */
const exists_country_by_id = async( id ) => {

    try { // If verification fails

        // Search for concidence (countries)
        const exists_country = await country.findById( id );

        if( !exists_country ) { // Answer if the country is not found
            throw { // Error message
                msg: `The country with the id '${id}' does not exist in DB `,
                msg_es: `El país con el identificador '${id}' no existe en BD`
            }
        }
        
    } catch(err) {

        console.log(err);
        throw { // Error message
            msg: "An error occurred while validate to country id",
            msg_es: "Ocurrio un error mientras se validaba el identificador del pais",
        }

    }

}

// Country validator
const validator_country = async( req, res = response, next ) => {

    try { // If verification fails

        // ID country require
        const { country_id } = req.params;

        // Read the country that corresponds to the uid
        const country_db = await country.findById( country_id );

        // Validate if the country does not exist in DB
        if( !country_db ) {
            return res.status(404).json({ // ERROR exist
                msg: `The country with the id '${ country_id }' does not exist in DB`,
                msg_es: `El país con el id '${ country_id }' no existe en BD`
            });
        } 

        // Response
        req.country = country_db;
        next();

    } catch(err) {

        console.log(err); 
        return res.status(500).json({ // Error message
            msg: "An error occurred while validate to country",
            msg_es: "Ocurrio un error mientras se validaba el pais",
        });

    }

}

/* State validator */
const exists_state_by_id = async( id ) => {

    try { // If verification fails
        
        // Search for concidence (states)
        const exists_state = await state.findById( id );

        if( !exists_state ) { // Answer if the state is not found
            throw { // Error message
                msg: `The state with the id '${ id }' does not exist in DB `,
                msg_es: `El estado con el identificador '${ id }' no existe en BD`
            }
        } 

    } catch(err) {

        console.log(err);
        throw { // Error message
            msg: "An error occurred while validate to state id",
            msg_es: "Ocurrio un error mientras se validaba el identificador del estado",
        }

    }

}

// State validator
const validator_state = async( req, res = response, next ) => {

    try { // If verification fails

        // ID state require
        const { state_id } = req.params;

        // Read the state that corresponds to the uid
        const state_db = await state.findById( state_id );

        // Validate if the state does not exist in DB
        if( !state_db ) {
            return res.status(404).json({ // ERROR exist
                msg: `The state with the id '${ state_id }' does not exist in DB`,
                msg_es: `El estado con el identificador '${ state_id }' no existe en BD`
            });
        } 

        // Response
        req.state = state_db;
        next();

    } catch(err) {

        console.log(err); 
        return res.status(500).json({ // Error message
            msg: "An error occurred while validate to state",
            msg_es: "Ocurrio un error mientras se validaba el estado",
        });

    }

}


/* Units validators */
const exists_unit_by_id = async( id ) => {

    try { // If verification fails

        // Search for concidence (units)
        const exists_unit = await unit.findById(id);

        if( !exists_unit ) {
            throw { // Error message
                msg: `La unidad con el identificador '${ id }' no existe`
            }
        } 

    } catch(err) {

        console.log(err);
        throw { // Error message
            msg: "Ocurrio un error mientras se validaba el identificador de la unidad",
        }

    }
    
}

const exists_warehouse_by_id = async( id ) => {

    try { // If verification fails

        // Search for concidence (almacenes)
        const exists_almacen = await almacen.findById(id);

        if( !exists_almacen ) {
            throw { // Error message
                msg: `El almacen con el id '${ id }' no existe`
            }
        } 

    } catch(err) {

        console.log(err);
        throw { // Error message
            msg: "Ocurrio un error mientras se validaba el identificador del almacen",
        }

    }
    
}


module.exports = {
    validator_state,
    exists_state_by_id,
    validator_country,
    exists_country_by_id,
    exists_unit_by_id,
    exists_warehouse_by_id
}