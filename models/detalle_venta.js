const {Schema, model} = require('mongoose');

const DetVentaSchema = Schema({
    venta: {
        type: Schema.Types.ObjectId,
        ref: 'Venta',
        required: true
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    costo_unit: {
        type: Number,
        default: 0
    },
    precio_unit: {
        type: Number,
        // producto.precio
        default: 0
    },
    cantidad: {
        type: Number,
    }
});

DetVentaSchema.methods.toJSON = function (){
    
    // Convierto el schema a un objeto de javascript con this.toObject
    const { __v, estado, ...data } = this.toObject();
    // saco el _v y el estado para no mostrarlos
    return data;
}

module.exports = model('DetVenta', DetVentaSchema);