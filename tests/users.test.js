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