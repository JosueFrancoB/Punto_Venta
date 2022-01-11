const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection, crearRoles } = require('../db/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.rutas = {
            auth: '/auth',
            buscar: '/buscar',
            categorias: '/categorias',
            productos: '/productos',
            uploads: '/uploads',
            users: '/users',
            providers: '/providers'
        }
        
        // Conectarse a db
        this.conectarDB();

        // Middlewares funciones que se ejecutan al inicio
        this.middlewares();

        //Crea roles en la db que se especifican en el archivo config.json
        this.dbRoles()

        // rutas
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    async dbRoles(){
        await crearRoles()
    }

    middlewares(){
        // CORS permite restringir accesos a tu app en producción
        this.app.use(cors());

        // LEctura y parseo del body, toda la de envios la parsea
        this.app.use(express.json());

        // Directorio publico que toma por defecto el indexhtml
        this.app.use(express.static('public'));

        // File upload - carga de archivos
        // createParentPath nos crea una carpeta al subir archivo en caso de que queramos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }

    routes(){
        this.app.use(this.rutas.auth,      require('../routes/authRoutes'));
        this.app.use(this.rutas.buscar,    require('../routes/buscarRoutes'));
        this.app.use(this.rutas.categorias,require('../routes/categoriasRoutes'));
        this.app.use(this.rutas.productos, require('../routes/productosRoutes'));
        this.app.use(this.rutas.uploads,   require('../routes/uploadsRoutes'));
        this.app.use(this.rutas.users,     require('../routes/usersRoutes'));
        this.app.use(this.rutas.providers, require('../routes/provRoutes'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server corriendo en', this.port);
        })
    }

}


module.exports = Server;