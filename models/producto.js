const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    clave: {
        type: String,
    },
    clave_alterna: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    precio_compra: {
        type: Number,
        default: 0
    },
    precio_venta: {
        type: Number,
        default: 0
    },
    unidad_venta:{
        type: String,
    },
    unidad_compra:{
        type: String,
    },
    factor: {
        type: Number,
        default: 1
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    },
    granel: {
        type: Boolean
    },
    inventario_max: {
        type: Number,
        default: 0
    },
    inventario_min: {
        type: Number,
        default: 0
    },
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',
    },
    existencias: {
        type: Number,
        default: 0
    }

});


ProductoSchema.methods.toJSON = function (){
    
    // Convierto el schema a un objeto de javascript con this.toObject
    const { __v, estado, ...data } = this.toObject();
    // saco el _v y el estado para no mostrarlos
    return data;
}

module.exports = model('Producto', ProductoSchema);