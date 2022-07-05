const {Schema, model} = require('mongoose');

const ProveedorSchema = Schema({
    nombre_contacto: {
        type: String
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
    rfc: {
        type: String,
        unique: true
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

ProveedorSchema.methods.toJSON = function (){
    
    // Convierto el schema a un objeto de javascript con this.toObject
    const { __v, estado, ...data } = this.toObject();
    // saco el _v y el estado para no mostrarlos
    return data;
}

module.exports = model('Proveedor', ProveedorSchema);