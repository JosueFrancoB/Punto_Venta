const mongoose = require('mongoose');
const fs = require('fs');
const {Role} = require('../models')

let config = JSON.parse(fs.readFileSync('./config/config.json'))

const dbConnection = async()=>{
    try {
        await mongoose.connect(`mongodb://${((config.mongo.user !== '') ? config.mongo.user + ':' + ((config.mongo.pass !== '') ? config.mongo.pass + '@' : '@') : '')}${config.mongo.host}${((config.mongo.port !== '') ? ':' + config.mongo.port : '')}/${config.mongo.db}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos conectada');
        
    } catch (error) {
        console.log(error);
        throw new Error('Conexion db fallida');
    }
}

const crearRoles = async()=>{
    let roles = []
    
    Object.keys(config.roles).forEach(key => roles.push(config.roles[key]))
    if(roles.length !== 0){
        for(let x in roles){
            const existeRol = await Role.findOne({rol: roles[x]});
            if (!existeRol){
                let rol = new Role({rol: roles[x]})
                await rol.save();
            }
        }
    }
}


module.exports= {
    dbConnection,
    crearRoles
}