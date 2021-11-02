const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El contraseña es obligatorio'],
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UsuarioSchema.methods.toJSON = function (){
    // Convierto el schema a un objeto de javascript con this.toObject
    const { __v, password, _id, ...usuario } = this.toObject();
    // Saco el __v version y el password para que no se muestre en el json, y todos los demás argumentos los guardo en usuario
    usuario.uid = _id;
    return usuario;
}



module.exports = model('Usuario', UsuarioSchema);