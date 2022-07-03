// Data Base Model (required)
const { Schema, model } = require('mongoose');

// Create day model (Modelo de dias)
const day_schema = Schema({
    day: {
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
    collection: 'day_statistics'
});

day_schema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

// Model export
// module.exports = day_schema;
module.exports = model( 'Day', day_schema );