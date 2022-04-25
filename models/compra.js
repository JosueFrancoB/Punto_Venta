const {Schema, model} = require('mongoose');

const CompraSchema = new Schema({
    fecha: {
        type: Date,
        default: Date.now,
        required : true
    },
    productos:[{
        id_producto: Schema.Types.ObjectId,
        nombre: String,
        cantidad: Number,
        precio: Number
    }],
    proveedor:{
        id_proveedor: Schema.Types.ObjectId,
        nombre: String
    },
    usuario_compra:{
        id_usuario: Schema.Types.ObjectId,
        nombre: String,
        apellido: String
    },
    estado:{
        type: Boolean,
        default: true
    }
});


module.exports = model('Compra', CompraSchema);