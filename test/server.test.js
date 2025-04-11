const request = require('supertest');
const app = require('../app');

describe('Test des routes du serveur', () => {
	test('GET / devrait répondre avec un statut 200', async () => {
		const response = await request(app).get('/');
		expect(response.statusCode).toBe(200);
	});
});