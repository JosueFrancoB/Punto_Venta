const {Schema, model} = require('mongoose');

const CompraSchema = new Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    productos:[{
        id_producto: Schema.Types.ObjectId,
        nombre: String,
        cantidad: Number,
        precio: Number,
        unidad_compra: String
    }],
    proveedor:{
        id_proveedor: Schema.Types.ObjectId,
        nombre_contacto: String,
        nombre_empresa: String
    },
    usuario_compra:{
        id_usuario: Schema.Types.ObjectId,
        nombre: String
    },
    total_compra:{
        type: Number
    },
    notas:{
        type: String
    },
    estado:{
        type: Boolean,
        default: true
    }
});


module.exports = model('Compra', CompraSchema);