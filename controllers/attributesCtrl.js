const {
    response,
    request
} = require("express");
// Models
const city = require('../models/city');
const state = require('../models/state');
const country = require('../models/country');
const Unit = require('../models/unit');


// Get cities by state 
const get_cities = async (req, res = response) => {

    try { // If there is error

        // Variables to receive (views and order)
        let {
            order = 'asc', order_field = 'name', search = ''
        } = req.query;
        let {
            limit = 10, from = 0
        } = req.query;
        let query = {
            id_state: req.state.id
        };

        // Check allowed fields
        const search_fields = ['name'];
        const include_field = search_fields.includes(order_field);
        if (!include_field) { // Conditional if field cannot be permited
            return res.status(404).json({ // ERROR allowed fields
                msg: `The field sort is not allowed: allowed fields '${ search_fields }'`,
                msg_es: `El campo a ordenar no es permitido: campos permitidos '${ search_fields }'`
            });
        }

        // If there's not limit
        if (limit == 'NO' || limit == 'No' || limit == 'no') {
            limit = '';
        }

        // Conditional for ordering (asc o desc)
        order = order == 'desc' ? -1 : 1;

        // Function for order (field and order)
        const sort = {
            [order_field]: order
        };

        if (search !== '') {

            // Check if the search term is an id
            const is_mongoid = ObjectId.isValid(search); // TRUE

            // Search if the term is an id
            if (is_mongoid) {
                const city_id = await city.findById(search);

                return res.status(200).json({ // Response in JSON format
                    cities: (city_id) ? [city_id] : []
                });
            }

            // Search by term
            search = await regexp_search_string(search);
            const regex = new RegExp(search, 'i');
            query = {
                $or: [{
                    name: regex
                }],
                $and: [{
                    id_state: req.state.id
                }]
            };

        }

        const [total, cities] = await Promise.all([
            city.countDocuments(query),
            city.find(query)
            .collation({
                locale: 'en'
            })
            .populate('state', 'name')
            .sort(sort)
            .skip(Number(from))
            .limit(Number(limit))
        ]);

        // Response in JSON format
        return res.status(200).json({
            total,
            cities
        });

    } catch (err) {

        console.log(err);
        return res.status(500).json({ // Error message
            msg: "An error occurred while to get cities",
            msg_es: "Ocurrio un error al obtener las ciudades",
        });

    }

}

// Get states by country
const get_states = async (req, res = response) => {

    try { // If there is error

        // Variables to receive (views and order)
        let {
            order = 'asc', order_field = 'name', search = ''
        } = req.query;
        let {
            limit = 10, from = 0
        } = req.query;
        let query = {
            id_country: req.country.id
        };

        // Check allowed fields
        const search_fields = ['name'];
        const include_field = search_fields.includes(order_field);
        if (!include_field) { // Conditional if field cannot be permited
            return res.status(400).json({ // ERROR allowed fields
                msg: `The field sort is not allowed: allowed fields '${ search_fields }'`,
                msg_es: `El campo a ordenar no es permitido: campos permitidos '${ search_fields }'`
            });
        }

        // If there's not limit
        if (limit == 'NO' || limit == 'No' || limit == 'no') {
            limit = '';
        }

        // Conditional for ordering (asc o desc)
        order = order == 'desc' ? -1 : 1;

        // Function for order (field and order)
        const sort = {
            [order_field]: order
        };

        if (search !== '') {

            // Check if the search term is an id
            const is_mongoid = ObjectId.isValid(search); // TRUE

            // Search if the term is an id
            if (is_mongoid) {
                const state_id = await state.findById(search);

                return res.status(200).json({ // Response in JSON format
                    states: (state_id) ? [state_id] : []
                });
            }

            // Search by term
            search = await regexp_search_string(search);
            const regex = new RegExp(search, 'i');
            query = {
                $or: [{
                    name: regex
                }],
                $and: [{
                    id_country: req.country.id
                }]
            };
        }

        const [total, states] = await Promise.all([
            state.countDocuments(query),
            state.find(query)
            .collation({
                locale: 'en'
            })
            .populate('country', 'name')
            .sort(sort)
            .skip(Number(from))
            .limit(Number(limit))
        ]);

        // Response in JSON format
        return res.status(200).json({
            total,
            states
        });

    } catch (err) {

        console.log(err);
        return res.status(500).json({ // Error message
            msg: "An error occurred while to get states",
            msg_es: "Ocurrio un error al obtener los estados",
        });

    }

}

// Get countries 
const get_countries = async (req, res = response) => {

    try { // If there is error

        // Variables to receive (views and order)
        let {
            order = 'asc', order_field = 'name', search = ''
        } = req.query;
        let {
            limit = 10, from = 0
        } = req.query;
        let query = {};

        // Check allowed fields
        const search_fields = ['name'];
        const include_field = search_fields.includes(order_field);
        if (!include_field) { // Conditional if field cannot be permited
            // Disonnect to DB
            mongo_get_countries.close(); // Close connection to database

            return res.status(404).json({ // ERROR allowed fields
                msg: `The field sort is not allowed: allowed fields '${ search_fields }'`,
                msg_es: `El campo a ordenar no es permitido: campos permitidos '${ search_fields }'`
            });
        }

        // If there's not limit
        if (limit == 'NO' || limit == 'No' || limit == 'no') {
            limit = '';
        }

        // Conditional for ordering (asc o desc)
        order = order == 'desc' ? -1 : 1;

        // Function for order (field and order)
        const sort = {
            [order_field]: order
        };

        if (search !== '') {

            // Check if the search term is an id
            const is_mongoid = ObjectId.isValid(search); // TRUE

            // Search if the term is an id
            if (is_mongoid) {
                const country_id = await country.findById(search);

                return res.status(200).json({ // Response in JSON format
                    countries: (country_id) ? [country_id] : []
                });
            }

            // Search by term
            search = await regexp_search_string(search);
            const regex = new RegExp(search, 'i');
            query = {
                name: regex
            };

        }

        const [total, countries] = await Promise.all([
            country.countDocuments(query),
            country.find(query)
            .collation({
                locale: 'en'
            })
            .sort(sort)
            .skip(Number(from))
            .limit(Number(limit))
        ]);

        // Response in JSON format
        return res.status(200).json({
            total,
            countries
        });

    } catch (err) {

        console.log(err);
        return res.status(500).json({ // Error message
            msg: "An error occurred while to get countries",
            msg_es: "Ocurrio un error al obtener los paises",
        });

    }

}


// Se les igualo req = request para que me aparezcan las opciones y ayudas de vscode
const unitsGet = async (req = request, res = response) => {

    // Para las peticiones con esto  ?q=hola&nombre=josu&apikey=8212&page=3&limite=10
    // Asigno page 1 por defecto en caso de que no manden ese argumento
    // const {nombre, apikey, page = 1, limit} = req.query;

    // Puedo mandar el limite de pagina en el query (en la url), y si no por defecto es 15 url?limite=15
    const {
        limite = 15, desde = 0
    } = req.query;
    const query = {
        estado: true
    };
    // con number lo convertimos porque viene en string
    // le ponemos que solo me traiga los que no esten borrados osea que tengan el estado true
    // const usuarios = await Usuario.find({estado: true})
    // .skip(Number(desde))
    // .limit(Number(limite));

    // const total = Usuario.countDocuments({estado: true});

    // En lugar de lo anterior de está manera las 2 promesas se ejecutan al mismo tiempo y hasta que esten las 2 estén se continua con lo demás
    const [total, unidades] = await Promise.all([
        Unit.countDocuments(query),
        Unit.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        ok: true,
        total,
        unidades
    });
}

const getUnitPorID = async (req, res = response) => {
    // En el params viene como id pero yo quiero que la variable sea _id para con findOne buscarlo en la DB
    const {
        id
    } = req.params;

    const unidad = await Unit.findById(id);

    res.json({
        ok: true,
        unidad
    })

}

const unitsPost = async (req, res = response) => {

    let {nombre, abreviacion} = req.body;
    nombre = nombre.toUpperCase().trim()
    if (abreviacion)
        abreviacion = abreviacion.toLowerCase().trim()
    const unitDB = await Unit.find({nombre, estado: true});
    if(unitDB.length > 0){
        return res.status(400).json({
            ok: false,
            msg: `La unidad ${nombre} ya existe`
        })
    }
    const unitAbvDB = await Unit.find({abreviacion, estado: true});
    if(unitAbvDB.length > 0){
        return res.status(400).json({
            ok: false,
            msg: `La abreviacion ${abreviacion} ya existe`
        })
    }
    const unidad = new Unit({nombre, abreviacion});


    await unidad.save();
    res.json({
        ok: true,
        unidad
    });
}

const unitsPatch = async (req, res = response) => {
    // Esto para cuando los parametros se los ponemos directos en la ruta
    const {id} = req.params;
    let {_id, ...resto} = req.body;
    if (resto.nombre)
        resto.nombre = resto.nombre.toUpperCase().trim()
    if (resto.abreviacion)
        resto.abreviacion = resto.abreviacion.toLowerCase().trim()
    const unitDB = await Unit.find({
        $and: [ { "_id": { $ne: id } }, { nombre: resto.nombre}, { estado: true } ]
    });
    if(unitDB.length > 0){
        return res.status(400).json({
            ok: false,
            msg: `La unidad ${resto.nombre} ya existe`
        })
    }

    const unitAbvDB = await Unit.find({
        $and: [ { "_id": { $ne: id } }, { abreviacion: resto.abreviacion}, { estado: true } ]
    });
    if(unitAbvDB.length > 0){
        return res.status(400).json({
            ok: false,
            msg: `La abreviacion ${resto.abreviacion} ya existe`
        })
    }

    const unidad = await Unit.findByIdAndUpdate(id, resto);

    res.json({
        ok: true,
        unidad
    });
}

const unitsDelete = async (req, res = response) => {

    const {id} = req.params;

    // Borrarlo fisicamente
    // const unidad = await Usuario.findByIdAndDelete(id);

    // Borrarlo solo para la vista
    const unidad = await Unit.findByIdAndUpdate(id, {estado: false});

    res.json({
        ok: true,
        unidad
    });
}

module.exports = {
    get_cities,
    get_states,
    get_countries,
    unitsGet,
    getUnitPorID,
    unitsPost,
    unitsPatch,
    unitsDelete
}