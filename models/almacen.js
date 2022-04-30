// Data Base Model (required)
const { Schema, model } = require('mongoose');

// Create unit model (Modelo de unidades)
const almacen_schema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del almacen es obligatorio']
    },
    alias: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    deshabilitado: {
        type: Boolean,
        default: false,
        required: true
    },
}, {
    collection: 'almacenes'
});

almacen_schema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

// Model export
// module.exports = unit_schema;
module.exports = model( 'Almacen', almacen_schema );