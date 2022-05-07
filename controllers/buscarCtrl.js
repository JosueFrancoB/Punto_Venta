const { response } = require("express");
const {ObjectId} = require("mongoose").Types;
const {Usuario, Categoria, Producto, Proveedor, Unidad, Almacen} = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'unidades',
    'almacenes',
    'proveedores',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True

    // Quiere decir que esta buscando con el id
    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : [],
            count: results.length
        })
    }

    // Lo hago que sea insensible a mayusculas y minusculas
    const regex = new RegExp(termino, 'i')

    // Busca que el termino este en nombre o en correo y que en cualquier caso el estado siempre sea true
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios,
        count: results.length
    })

}

const buscarCategorias = async(termino = '', res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True

    // Quiere decir que esta buscando con el id
    if(esMongoId){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : [],
            count: categoria.length
        })
    }

    // Lo hago que sea insensible a mayusculas y minusculas
    const regex = new RegExp(termino, 'i')

    // Busca que el termino este en nombre y el estado siempre sea true
    const categorias = await Categoria.find({nombre: regex, estado: true});

    res.json({
        results: categorias,
        count: categorias.length
    })

}

const buscarProductos = async(termino = '', res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True

    // Quiere decir que esta buscando con el id
    if(esMongoId){
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : [],
            count: producto.length
        })
    }

    // Lo hago que sea insensible a mayusculas y minusculas
    const regex = new RegExp(termino, 'i');

    //Para Buscar todos los productos con una categoría
    const categoria = await Categoria.find({nombre: regex});
    let idCategoria;

    // el find de categoria devuelve un arreglo, si no encuentra nada esta vacío
    if(categoria.length > 0){
        idCategoria  = categoria[0]._id;
    }else{
        idCategoria = 0;
    }
    // Busca que el termino este en nombre o por categoria y que en cualquier caso el estado siempre sea true
    const productos = await Producto.find({
        $or: [{nombre: regex}, {clave: regex}, {clave_alterna: regex}, {categoria: ObjectId(idCategoria)}],
        $and: [{estado: true}]
        
    }).populate('categoria', 'nombre');
    

    res.json({
        results: productos,
        count: productos.length
    })

}


const buscarUnidades = async(termino = '', res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True

    // Quiere decir que esta buscando con el id
    if(esMongoId){
        const unidad = await Unidad.findById(termino);
        return res.json({
            results: (unidad) ? [unidad] : [],
            count: unidad.length
        })
    }

    // Lo hago que sea insensible a mayusculas y minusculas
    const regex = new RegExp(termino, 'i')

    // Busca que el termino este en nombre y el estado siempre sea true
    const unidades = await Unidad.find({nombre: regex, estado: true});

    res.json({
        results: unidades,
        count: unidades.length
    })

}

const buscarAlmacenes = async(termino = '', res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True

    // Quiere decir que esta buscando con el id
    if(esMongoId){
        const almacen = await Almacen.findById(termino);
        return res.json({
            results: (almacen) ? [almacen] : [],
            count: almacen.length
        })
    }

    // Lo hago que sea insensible a mayusculas y minusculas
    const regex = new RegExp(termino, 'i')

    // Busca que el termino este en nombre y el estado siempre sea true
    const almacenes = await Almacen.find({nombre: regex, estado: true});

    res.json({
        results: almacenes,
        count: almacenes.length
    })

}

const buscarProveedores = async(termino = '', res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True

    // Quiere decir que esta buscando con el id
    if(esMongoId){
        const proveedor = await Proveedor.findById(termino);
        return res.json({
            results: (proveedor) ? [proveedor] : [],
            count: proveedor.length
        })
    }

    // Lo hago que sea insensible a mayusculas y minusculas
    const regex = new RegExp(termino, 'i')

    // Busca que el termino este en nombre y el estado siempre sea true
    const proveedores = await Proveedor.find({nombre: regex, estado: true});

    res.json({
        results: proveedores,
        count: proveedores.length
    })

}


const buscar = (req, res = response)=>{

    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
        case 'unidades':
            buscarUnidades(termino, res);
        break;
        case 'almacenes':
            buscarAlmacenes(termino, res);
        break;
        case 'proveedores':
            buscarProveedores(termino, res);
        break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
        break;
    }
}

module.exports = {
    buscar
}