const {Schema, model} = require('mongoose');


const VentaSchema = new Schema({

    fecha: {
        type: Date,
        default: Date.now
    },
    codigo:{
        type: String
    },
    total_a_pagar:{
        type: Number
    },
    iva:{
        type: Number,
        default: 0
    },
    descuento:{
        type: Number,
        default: 0
    },
    productos:[{
        id_producto: Schema.Types.ObjectId,
        nombre: String,
        precio: Number,
        cantidad: Number,
    }],
    cliente:{
        id_cliente: Schema.Types.ObjectId,
        nombre: String,
        nombre_empresa: String
    },
    usuario_venta:{
        id_usuario: Schema.Types.ObjectId,
        nombre: String
    },
    estado:{
        type: Boolean,
        default: true
    },
    notas:{
        type: String
    },
    cancelada:{
        type: Boolean,
        default: false
    }
});

module.exports = model('Venta', VentaSchema);