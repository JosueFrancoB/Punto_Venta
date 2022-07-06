const Role = require('../models/role');
const {Usuario, Categoria, Producto, Proveedor, Cliente} = require('../models');

const esRoleValido = async(rol = '') =>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la base de datos`)
    }
}

// Verificar si el correo es repetido
const emailExiste = async(correo = '', db_model = "")=>{
    var existeEmail = undefined
    switch (db_model) {
        case 'user':
            existeEmail = await Usuario.findOne({correos: correo, estado: true})
            break;
        case 'prov':
            existeEmail = await Proveedor.findOne({correos: correo, estado: true})
            break;
        case 'cli':
            existeEmail = await Cliente.findOne({correos: correo, estado: true})
            break;
        default:
            break;
    }
    
    if(existeEmail){
        throw new Error(`El correo ${correo}, ya está registrado`)
    }
    return true;
}

// Verificar si el usuario existe
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

// Verificar si el proveedor existe
const existeProveedorPorId = async (id) =>{
    const existeProveedor = await Proveedor.findById(id);
    if(!existeProveedor){
        throw new Error(`El id ${id} no existe`)
    }
}

// Verificar si el cliente existe
const existeClientePorId = async (id) =>{
    const existeCliente = await Cliente.findById(id);
    if(!existeCliente){
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

const stadisticasPermitidas = (stadistica = '', stadisticas = []) =>{
    const incluida = stadisticas.includes(stadistica);
    if(!incluida){
        throw new Error(`La stadistica ${stadistica} no es permitida, ${stadisticas}`)
    }
    return true;
}

const telefonoUnico = async(telefono = '', db_model = "") =>{
    var existeTelefono = undefined
    switch (db_model) {
        case "prov":
            existeTelefono = await Proveedor.findOne({telefonos: telefono, estado: true})
            break
        case "cli":
            existeTelefono = await Cliente.findOne({telefonos: telefono, estado: true})
            break
        default:
            break;
    }
    if (existeTelefono){
        throw new Error(`El teléfono ${telefono} ya existe`)
    }
    return true;
}

// Función para validar un RFC México
// Devuelve el RFC sin espacios ni guiones si es correcto
// Devuelve false si es inválido
// (debe estar en mayúsculas, guiones y espacios intermedios opcionales)
const validarRFC = (rfc)=> {
    if (!rfc) return true
    const re = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
    var validado = rfc.match(re);
    if (validado === null)  // Coincide con el formato general del regex?
        throw new Error(`El RFC no es válido`);
    return true
}

module.exports ={
    esRoleValido,
    emailExiste,
    existeUserPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas,
    stadisticasPermitidas,
    telefonoUnico,
    existeProveedorPorId,
    existeClientePorId,
    validarRFC
} 