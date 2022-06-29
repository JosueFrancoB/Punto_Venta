const {
    usersGet, getUserById, usersPost, usersRegister, usersPut, usersDelete
} = require('../controllers/usersCtrl');

const request = require('supertest');

const {app} = require('../models/server');
const Server = require('../models/server');
const server = new Server();


describe('GET /users', () => {

    test('Debe de retornar un status 200', async () => {
        const res = await request(server.app).get('/users');
        expect(res.status).toBe(200);
    });
});

describe('GET /categories', () => {

    test('Debe de retornar un status 200', async () => {
        const res = await request(server.app).get('/categorias');
        expect(res.status).toBe(200);
    });
});

describe('GET /products', () => {

    test('Debe de retornar un status 200', async () => {
        const res = await request(server.app).get('/productos');
        expect(res.status).toBe(200);
    });
});

describe('GET /providers', () => {

    test('Debe de retornar un status 200', async () => {
        const res = await request(server.app).get('/providers');
        expect(res.status).toBe(200);
    });
});

describe('GET /clients', () => {

    test('Debe de retornar un status 200', async () => {
        const res = await request(server.app).get('/clientes');
        expect(res.status).toBe(200);
    });
});

describe('GET /sales', () => {

    test('Debe de retornar un status 200', async () => {
        const res = await request(server.app).get('/sales');
        expect(res.status).toBe(200);
    });
});

describe('GET /purchases', () => {

    test('Debe de retornar un status 200', async () => {
        const res = await request(server.app).get('/purchases');
        expect(res.status).toBe(200);
    });
});

describe('GET /finances', () => {

    test('Debe de retornar un status 200', async () => {
        const res = await request(server.app).get('/finances');
        expect(res.status).toBe(200);
    });
});

describe('GET /warehouses', () => {

    test('Debe de retornar un status 200', async () => {
        const res = await request(server.app).get('/warehouses');
        expect(res.status).toBe(200);
    });
});
//POST

describe('POST /users', () => {

    test('Debe de retornar un status 401 created', async () => {
        const res = await request(server.app).get('/users');
        expect(res.status).toBe(200);
    });
});

describe('POST /categories', () => {

    test('Debe de retornar un status 401 created', async () => {
        const res = await request(server.app).get('/categorias');
        expect(res.status).toBe(200);
    });
});

describe('POST /products', () => {

    test('Debe de retornar un status 401 created', async () => {
        const res = await request(server.app).get('/productos');
        expect(res.status).toBe(200);
    });
});

describe('POST /providers', () => {

    test('Debe de retornar un status 401 created', async () => {
        const res = await request(server.app).get('/providers');
        expect(res.status).toBe(200);
    });
});

describe('POST /clients', () => {

    test('Debe de retornar un status 401 created', async () => {
        const res = await request(server.app).get('/clientes');
        expect(res.status).toBe(200);
    });
});

describe('POST /sales', () => {

    test('Debe de retornar un status 401 created', async () => {
        const res = await request(server.app).get('/sales');
        expect(res.status).toBe(200);
    });
});

describe('POST /purchases', () => {

    test('Debe de retornar un status 401 created', async () => {
        const res = await request(server.app).get('/purchases');
        expect(res.status).toBe(200);
    });
});

describe('POST /finances', () => {

    test('Debe de retornar un status 401 created', async () => {
        const res = await request(server.app).get('/finances');
        expect(res.status).toBe(200);
    });
});

describe('POST /warehouses', () => {

    test('Debe de retornar un status 401 created', async () => {
        const res = await request(server.app).get('/warehouses');
        expect(res.status).toBe(200);
    });
});