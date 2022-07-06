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
    seller_employees: {
        type: [],
        default: []
    },
    money_employees: {
        type: [],
        default: []
    },
    rich_clients: {
        type: [],
        default: []
    },
    frecuency_clients: {
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