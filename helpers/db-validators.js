const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');

const esRoleValido = async(rol = '') =>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la base de datos`)
    }
}

// Verificar si el correo es repetido
const emailExiste = async(correo = '')=>{
    const existeEmail = await Usuario.findOne({correo: correo});
    if(existeEmail){
        throw new Error(`El correo ${correo}, ya está registrado`)
    }
}

// Verificar si el correo es repetido
const existeUserPorId = async (id) =>{
    const existeUser = await Usuario.findById(id);
    if(!existeUser){
        throw new Error(`El id ${id} no existe`)
    }
}

// Verificar si la categoria existe
const existeCategoriaPorId = async (id) =>{
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`El id ${id} no existe`)
    }
}

// Verificar si la categoria existe
const existeProductoPorId = async (id) =>{
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`El id ${id} no existe`)
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) =>{
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    }
    return true;
}

module.exports ={
    esRoleValido,
    emailExiste,
    existeUserPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
} 