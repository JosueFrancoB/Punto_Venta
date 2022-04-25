// Data Base Model (required)
const { Schema, model } = require('mongoose');

// Create country model (Modelo de los paises)
const country_schema = Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Country name is required'],
        unique: true
    }
}, {
    collection: 'countries'
});

country_schema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

// Model export
// module.exports = country_schema;
module.exports = model( 'country', country_schema );