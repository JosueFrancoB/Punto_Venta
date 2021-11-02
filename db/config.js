const mongoose = require('mongoose');



const dbConnection = async()=>{
    try {

        await mongoose.connect(process.env.MONGODB_CONN, {
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