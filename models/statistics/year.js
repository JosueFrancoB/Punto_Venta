// Data Base Model (required)
const { Schema, model } = require('mongoose');

// Create year model (Modelo de dias)
const year_schema = Schema({
    year: {
        type: String,
    },
    most_selled_products: {
        type: [],
        default: []
    },
    best_employees: {
        type: [],
        default: []
    },
    best_clients: {
        type: [],
        default: []
    },
    products:{
        type: [],
        default: []
    },
    employees:{
        type: [],
        default: []
    },
    clients:{
        type: [],
        default: []
    },
}, {
    collection: 'year_statistics'
});

year_schema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

// Model export
// module.exports = year_schema;
module.exports = model( 'Year', year_schema );