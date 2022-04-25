// Data Base Model (required)
const { Schema, model } = require('mongoose');

// Create unit model (Modelo de unidades)
const unit_schema = Schema({
    nombre: {
        type: String,
        required: [true, 'Unit nombre is required']
    },
    abreviacion: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
}, {
    collection: 'units'
});

unit_schema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

// Model export
// module.exports = unit_schema;
module.exports = model( 'Unit', unit_schema );