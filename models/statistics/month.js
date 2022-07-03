// Data Base Model (required)
const { Schema, model } = require('mongoose');

// Create month model (Modelo de dias)
const month_schema = Schema({
    month: {
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
    collection: 'month_statistics'
});

month_schema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

// Model export
// module.exports = month_schema;
module.exports = model( 'Month', month_schema );