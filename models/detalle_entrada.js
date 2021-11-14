const {Schema, model} = require('mongoose');

const DetEntradaSchema = Schema({
    entrada: {
        type: Schema.Types.ObjectId,
        ref: 'Entrada',
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
    cantidad: {
        type: Number,
    }
});

DetEntradaSchema.methods.toJSON = function (){
    
    // Convierto el schema a un objeto de javascript con this.toObject
    const { __v, estado, ...data } = this.toObject();
    // saco el _v y el estado para no mostrarlos
    return data;
}

module.exports = model('DetEntrada', DetEntradaSchema);