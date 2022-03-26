const {Schema, model} = require('mongoose');


const VentaSchema = new Schema({

    fecha: {
        type: Date
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
        apellido: String,
    },
    usuario_venta:{
        id_usuario: Schema.Types.ObjectId,
        nombre: String,
        apellido: String,
    },
    estado:{
        type: Boolean,
        default: true
    },
    cancelada:{
        type: Boolean,
        default: false
    }
});

module.exports = model('Venta', VentaSchema);