const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.disconnect();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Authentication Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'testuser@example.com', password: 'testpassword' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'User registered successfully'
      );
    });

    it('a user already exists', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'testuser@example.com', password: 'testpassword' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'testuser@example.com', password: 'testpassword' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should return 400 for a bad request', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: '' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        'message',
        expect.stringContaining('Error registering user')
      );
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'testuser@example.com', password: 'testpassword' });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testuser@example.com', password: 'testpassword' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for unauthorized access', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testuser@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        'message',
        'Email or password is incorrect'
      );
    });
  });
});
