const { response } = require("express");
const {subirArchivo} = require('../helpers');
const {Usuario, Producto, Categoria} = require('../models');
const path = require('path');
const fs = require('fs');

const cargarArchivo = async(req, res=response)=>{

    try {

        //txt md
        // const nombre = await subirArchivo(req.files, ['txt', 'md']);
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({nombre, ok: true})

    } catch (msg) {
        res.status(400).json({
            ok: false,
            msg
        })
    }


}

const actualizarImagen = async(req, res=response)=>{

    const {id, coleccion} = req.params;
    let modelo;

    switch(coleccion){
        case 'users':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    ok: false,
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    ok: false,
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
        case 'categorias':
            modelo = await Categoria.findById(id);
            if(!modelo){
                return res.status(400).json({
                    ok: false,
                    msg: `No existe un categoria con el id ${id}`
                })
            }
        break;
        default:
            return res.status(500).json({
                ok: false,
                msg: 'Se me olvido programar esto'
            })
    }

    // Limpiar imágenes previas
    if(modelo.img){
        // Hay que borrar imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        // Compruebo si esa imagen existe
        if(fs.existsSync(pathImg)){
            // Elimina el archivo y solo dejaría uno para cada usuario o producto
            fs.unlinkSync(pathImg);
        }
    }
    


    // file, extensionesPermitidas, nombreCarpeta
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();
    res.json({
        ok: true,
        modelo
    });
}

const mostrarImagen = async(req, res=response)=>{

    const {id, coleccion} = req.params;
    let modelo;

    switch(coleccion){
        case 'users':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    ok: false,
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    ok: false,
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
        case 'categorias':
            modelo = await Categoria.findById(id);
            if(!modelo){
                return res.status(400).json({
                    ok: false,
                    msg: `No existe una categoria con el id ${id}`
                })
            }
        break;
        default:
            return res.status(500).json({
                ok: false,
                msg: 'Se me olvido programar esto'
            })
    }

    // Limpiar imágenes previas
    if(modelo.img){
        // Hay que borrar imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        // Compruebo si esa imagen existe
        if(fs.existsSync(pathImg)){
            return res.sendFile(pathImg);
        }
    }

    const pathDefaultImg = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathDefaultImg);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}