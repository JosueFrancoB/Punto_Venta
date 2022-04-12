const {Schema, model} = require('mongoose');

const ClienteSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    nombre_empresa: {
        type: String,
        required: [true, 'El nombre de la empresa es obligatorio'],
    },
    telefonos: {
        type: [String],
        default: []
    },
    correos: {
        type: [String],
        default: []
    },
    img: {
        type: String
    },
    direcciones: {
        type: [String],
        default: []
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }
});

ClienteSchema.methods.toJSON = function (){
    
    // Convierto el schema a un objeto de javascript con this.toObject
    const { __v, estado, ...data } = this.toObject();
    // saco el _v y el estado para no mostrarlos
    return data;
}

module.exports = model('Cliente', ClienteSchema);