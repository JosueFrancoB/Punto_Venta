// Data Base Model (required)
const { Schema, model } = require('mongoose');

// Create state model (Modelo de los estados)
const state_schema = Schema({
    id: {
        type: Number,
        unique: true
    },
    id_country: {
        type: Number,
        ref: 'country',
        required: true
    },
    name: {
        type: String,
        required: [true, 'State name is required'],
        unique: true
    }
}, {
    collection: 'states'
});

state_schema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

// Model export
// module.exports = state_schema;
module.exports = model( 'state', state_schema );