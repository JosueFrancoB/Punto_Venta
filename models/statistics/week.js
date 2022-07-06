// Data Base Model (required)
const { Schema, model } = require('mongoose');

// Create year model (Modelo de dias)
const week_schema = Schema({
    week: {
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
    collection: 'week_statistics'
});

week_schema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

// Model export
// module.exports = year_schema;
module.exports = model( 'Week', week_schema );