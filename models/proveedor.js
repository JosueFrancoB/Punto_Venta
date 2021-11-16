const {Schema, model} = require('mongoose');

const ProveedorSchema = Schema({
    nombre_contacto: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    nombre_empresa: {
        type: String,
        required: [true, 'El nombre de la empresa es obligatorio'],
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        unique: true
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    rfc: {
        type: String,
        unique: true
    },
    img: {
        type: String
    },
    direccion: {
        type: String,
        unique: true
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