// Data Base Model (required)
const { Schema, model } = require('mongoose');

// Create city model (Modelo de las ciudades)
const city_schema = Schema({
    id: {
        type: Number,
        unique: true
    },
    id_state: {
        type: Number,
        ref: 'state',
        required: true
    },
    name: {
        type: String,
        required: [true, 'City name is required'],
        unique: true
    }
}, {
    collection: 'cities'
});

city_schema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

// Model export
// module.exports = city_schema;
module.exports = model( 'city', city_schema );