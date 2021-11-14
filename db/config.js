const mongoose = require('mongoose');
const fs = require('fs');


const dbConnection = async()=>{
    try {

        let config = JSON.parse(fs.readFileSync('./config/config.json'))
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


module.exports= {
    dbConnection
}