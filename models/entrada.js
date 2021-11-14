const {Schema, model} = require('mongoose');

const EntradaSchema = Schema({
    fecha: {
        type: Date
    },
    total_pagar: {
        type: Number
    }
});

EntradaSchema.methods.toJSON = function (){
    
    // Convierto el schema a un objeto de javascript con this.toObject
    const { __v, estado, ...data } = this.toObject();
    // saco el _v y el estado para no mostrarlos
    return data;
}

module.exports = model('Entrada', EntradaSchema);   