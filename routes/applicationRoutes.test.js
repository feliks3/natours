require('../loadEnv');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../server');
const Application = require('../models/Application');
const jwt = require('jsonwebtoken');

jest.mock('../models/Application');

describe('Application Routes', () => {
  let mongoServer;
  let userId, token;

  beforeAll(() => {
    Application.find.mockImplementation(() => {
      return {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockReturnValue([]),
      };
    });
  });
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    userId = new mongoose.Types.ObjectId();
    token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    await mongoose.disconnect();
    await mongoose.connect(uri);
  });

  beforeEach(async () => {
    await Application.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/applications', () => {
    it('should get applications successfully', async () => {
      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('applications');
    });
    it('token is not provided', async () => {
      const response = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token is not valid');
    });
  });

  describe('POST /api/applications', () => {
    const userId = new mongoose.Types.ObjectId();
    const testApplication = {
      _id: new mongoose.Types.ObjectId(),
      name: 'testApplicationName',
      description: 'testApplicationDescription',
      personalDetails: 'testApplicationDetails',
      income: 50000,
      expenses: 20000,
      assets: 100000,
      liabilities: 50000,
      userId: userId.toString(),
    };

    it('should get an application successfully', async () => {
      // Application.prototype.save = jest.fn().mockResolvedValue(testApplication);
      Application.prototype.save.mockResolvedValue(testApplication);
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'testApplicationName',
          description: 'testApplicationDescription',
          personalDetails: 'testApplicationDetails',
          income: 50000,
          expenses: 20000,
          assets: 100000,
          liabilities: 50000,
        });
      expect(response.status).toBe(201);
      // expect(response.json).toBeCalled();
    });

    it('token is not provided', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token is not valid');
    });
  });

  describe('DELETE /api/applications/{id}', () => {
    const applicationToDelete = {
      id: 'testApplicationId',
      name: 'testApplicationName',
      description: 'testApplicationDescription',
      personalDetails: 'testApplicationDetails',
      income: 50000,
      expenses: 20000,
      assets: 100000,
      liabilities: 50000,
      userId: '',
      isDeleted: false,
      save: jest.fn(),
    };

    it('delete application successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      applicationToDelete.userId = userId;
      Application.findById.mockResolvedValue(applicationToDelete);
      const response = await request(app)
        .delete(`/api/applications/${applicationToDelete.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Application is deleted');
    });

    it('token is not provided', async () => {
      const response = await request(app).delete(
        `/api/applications/${applicationToDelete.id}`
      );
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        'message',
        'No token, authorization denied'
      );
    });

    it('userid not match', async () => {
      token = jwt.sign({ userId: 'incorrectUserId' }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      const response = await request(app)
        .delete(`/api/applications/${applicationToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('user', 'incorrectTestUserId');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Application not found or unauthorized to delete'
      );
    });
  });
  describe('UPDATE /api/applications/{id}', () => {
    const applicationToUpdate = {
      id: 'testApplicationId',
      userId: '',
      isDeleted: false,
      save: jest.fn(),
    };
    const userId = new mongoose.Types.ObjectId();
    const updatedApplication = {
      name: 'updatedApplicationName',
      description: 'updatedApplicationDescription',
      personalDetails: 'updatedApplicationDetails',
      income: 60000,
      expenses: 30000,
      assets: 150000,
      liabilities: 40000,
      id: 'testApplicationId',
      isDeleted: false,
      userId: `${userId}`,
    };
    it('update an application successful', async () => {
      Application.findById.mockResolvedValue(applicationToUpdate);
      applicationToUpdate.userId = userId;
      token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      const response = await request(app)
        .put(`/api/applications/${applicationToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedApplication);
      const { save, ...expectedApplication } = updatedApplication;
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(expectedApplication);
    });

    it('token is not provided', async () => {
      const userId = new mongoose.Types.ObjectId();

      Application.findById.mockResolvedValue(applicationToUpdate);
      applicationToUpdate.userId = userId;
      token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      const response = await request(app)
        .put(`/api/applications/${applicationToUpdate.id}`)
        .send(updatedApplication);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        'message',
        'No token, authorization denied'
      );
    });
  });
});
