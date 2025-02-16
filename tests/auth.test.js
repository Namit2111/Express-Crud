const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Namit Jain',
        email: 'example@gmail.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
});
