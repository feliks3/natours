require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const User = require('../models/User');
const app = require('../server');
const request = require('supertest');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Authentication Routes', () => {
  it('should register a new user successfully', async () => {
    const response = await request(app).post('/register').send({
      email: 'test@example.com',
      password: 'testpassword',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'User registered successfully'
    );
  });

  it('should login an existing user successfully', async () => {
    await User.create({ email: 'test@example.com', password: 'testpassword' });

    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'testpassword',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
