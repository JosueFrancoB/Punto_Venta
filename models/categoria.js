const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    img: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }

});


CategoriaSchema.methods.toJSON = function (){
    
    // Convierto el schema a un objeto de javascript con this.toObject
    const { __v, estado, ...data } = this.toObject();
    // saco el _v y el estado para no mostrarlos
    return data;
}

module.exports = model('Categoria', CategoriaSchema);