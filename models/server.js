const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection, crearRoles } = require('../db/config');
const startConfig = require('../helpers/start-config');


class Server{

    constructor(){
        console.clear();
        this.app = express();
        this.server = require('http').createServer(this.app);
        this.cargarConfig();
    }
    async cargarConfig(){
        await startConfig();
        this.port = global.app.port;

        this.rutas = {
            auth: '/auth',
            buscar: '/buscar',
            categorias: '/categorias',
            productos: '/productos',
            uploads: '/uploads',
            users: '/users',
            providers: '/providers',
            clients: '/clientes',
            attributes: '/attributes',
            sales: '/sales',
            purchases: '/purchases',
            finances: '/finances',
            warehouses: 'warehouses'
        };

        //Midlewares
        this.middlewares();
        // Conectarse a db
        this.conectarDB();

         //Crea roles en la db que se especifican en el archivo config.json
        this.dbRoles();

        // rutas
        this.routes();

        this.listen();

    }

    async conectarDB(){
        await dbConnection();
    }

    async dbRoles(){
        await crearRoles();
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
        this.app.use(this.rutas.clients, require('../routes/clientesRoutes'));
        this.app.use(this.rutas.clients, require('../routes/clientesRoutes'));
        this.app.use(this.rutas.attributes, require('../routes/attrRoutes'));
        this.app.use(this.rutas.sales,     require('../routes/salesRoutes'));
        this.app.use(this.rutas.purchases, require('../routes/comprasRoutes'));
        this.app.use(this.rutas.finances, require('../routes/financesRoutes'));
        this.app.use(this.rutas.warehouses, require('../routes/almacenRoutes'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Server corriendo en', this.port);
        });
    }

}


module.exports = Server;