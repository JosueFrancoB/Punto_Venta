const { response } = require("express");
const {ObjectId} = require("mongoose").Types;
const {Usuario, Categoria, Producto, Proveedor, Unidad, Almacen, Cliente} = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'unidades',
    'almacenes',
    'proveedores',
    'clientes',
    'roles'
];

const buscarUsuarios = async(termino = '', req, res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True
    const {limit = 5, from = 0} = req.query;

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
    }).skip(Number(from)).limit(Number(limit));

    res.json({
        results: usuarios,
        count: results.length
    })

}

const buscarCategorias = async(termino = '', req, res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True
    const {limit = 5, from = 0} = req.query;

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
    const categorias = await Categoria.find({
        nombre: regex, estado: true
    }).skip(Number(from)).limit(Number(limit));

    res.json({
        results: categorias,
        count: categorias.length
    })

}

const buscarProductos = async(termino = '', req, res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True
    const {limit = 5, from = 0, filter = 'nombre'} = req.query;

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
    let productos = {}

    if (filter === 'categoria'){
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
        productos = await Producto.find({$or: [{nombre: regex}, {clave: regex}, {clave_alterna: regex}, {categoria: ObjectId(idCategoria)}], $and: [{estado: true}]}).sort({nombre: 'asc'}).populate('categoria', 'nombre').skip(Number(from)).limit(Number(limit));
    }else{
        productos = await Producto.find({
            $or: [{nombre: regex}, {clave: regex}, {clave_alterna: regex}],
            $and: [{estado: true}]
        }).sort({nombre: 'asc'}).skip(Number(from)).limit(Number(limit));
    }

    res.json({
        results: productos,
        count: productos.length
    })

}


const buscarUnidades = async(termino = '', req, res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True
    const {limit = 5, from = 0} = req.query;

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
    const unidades = await Unidad.find({
        nombre: regex, estado: true
    }).skip(Number(from)).limit(Number(limit));

    res.json({
        results: unidades,
        count: unidades.length
    })

}

const buscarAlmacenes = async(termino = '', req, res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True
    const {limit = 5, from = 0} = req.query;

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
    const almacenes = await Almacen.find({
        nombre: regex, estado: true
    }).skip(Number(from)).limit(Number(limit));

    res.json({
        results: almacenes,
        count: almacenes.length
    })

}

const buscarProveedores = async(termino = '', req, res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True
    const {limit = 5, from = 0} = req.query;

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
    const proveedores = await Proveedor.find({
        nombre: regex, estado: true
    }).skip(Number(from)).limit(Number(limit));

    res.json({
        results: proveedores,
        count: proveedores.length
    })

}

const buscarClientes = async(termino = '', req, res = response)=>{
    
    const esMongoId = ObjectId.isValid(termino); //True
    const {limit = 5, from = 0} = req.query;

    // Quiere decir que esta buscando con el id
    if(esMongoId){
        const cliente = await Cliente.findById(termino);
        return res.json({
            results: (cliente) ? [cliente] : [],
            count: cliente.length
        })
    }

    // Lo hago que sea insensible a mayusculas y minusculas
    const regex = new RegExp(termino, 'i')

    // Busca que el termino este en nombre y el estado siempre sea true
    const clientes = await Cliente.find({
        nombre: regex, estado: true
    }).skip(Number(from)).limit(Number(limit));

    res.json({
        results: clientes,
        count: clientes.length
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
            buscarUsuarios(termino, req, res);
        break;
        case 'categorias':
            buscarCategorias(termino, req, res);
        break;
        case 'productos':
            buscarProductos(termino, req, res);
        break;
        case 'unidades':
            buscarUnidades(termino, req, res);
        break;
        case 'almacenes':
            buscarAlmacenes(termino, req, res);
        break;
        case 'proveedores':
            buscarProveedores(termino, req, res);
        break;
        case 'clientes':
            buscarClientes(termino, req, res);
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