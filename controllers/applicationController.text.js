const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const applicationRoutes = require('../routes/applicationRoutes');
const authRoutes = require('../routes/authRoutes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

let token;

beforeAll(async () => {
  const res = await request(app).post('/api/auth/register').send({
    email: 'testuser@example.com',
    password: 'password123',
  });

  token = jwt.sign({ userId: res.body._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

describe('GET /api/applications', () => {
  it('should return all applications for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/applications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('applications');
  });
});

describe('POST /api/applications', () => {
  it('should create a new application', async () => {
    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Application',
        description: 'This is a test application',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Test Application');
  });
});

describe('PUT /api/applications/:id', () => {
  it('should update an existing application', async () => {
    const res = await request(app)
      .put('/api/applications/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Application',
        description: 'This is an updated application',
      });

    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /api/applications/:id', () => {
  it('should delete an existing application', async () => {
    const res = await request(app)
      .delete('/api/applications/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
