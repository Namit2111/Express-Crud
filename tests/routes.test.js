const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Auth and User Routes', () => {
  let userToken, adminToken, createdUserId;

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();

    const userRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: 'user@example.com', password: 'password123' });
    userToken = userRes.body.token;


    const adminRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Admin User', email: 'admin@example.com', password: 'password123' });
    adminToken = adminRes.body.token;

    const adminUser = await User.findOne({ email: 'admin@example.com' });
    adminUser.role = 'admin';
    await adminUser.save();

  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('Auth Endpoints', () => {
    it('should signup a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Jane Doe', email: 'jane@example.com', password: 'password123' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should not signup with invalid input', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: '', email: 'invalid', password: 'short' });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'password123' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'wrongpassword' });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('User Endpoints (Protected)', () => {
    it('should create a new user (POST /api/users)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'New User', email: 'newuser@example.com', role: 'user' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      createdUserId = res.body._id;
    });

    it('should get all users (GET /api/users)', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get a single user by id (GET /api/users/:id)', async () => {
      const res = await request(app)
        .get(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', createdUserId);
    });

    it('should update a user (PUT /api/users/:id)', async () => {
      const res = await request(app)
        .put(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated User', email: 'updateduser@example.com', role: 'user' });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Updated User');
      expect(res.body).toHaveProperty('email', 'updateduser@example.com');
    });

    it('should not delete a user with non-admin token (DELETE /api/users/:id)', async () => {
      const res = await request(app)
        .delete(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized as an admin');
    });

    it('should delete a user with an admin token (DELETE /api/users/:id)', async () => {
      const res = await request(app)
        .delete(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'User removed');
    });
  });
});
