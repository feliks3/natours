const { register, login } = require('./authController');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const req = {
        body: {
          email: 'testuser@example.com',
          password: 'testpassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('testSalt');
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.prototype.save = jest.fn().mockResolvedValue();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
      });
    });

    it('a user exists, then register fail', async () => {
      const req = {
        body: { email: 'testuser@example.com', password: 'testpassword' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = { _id: 'userId123', password: 'hashedpassword' };

      User.findOne.mockResolvedValue(mockUser);

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('throw error when saving new user', async () => {
      const req = {
        body: {
          email: 'testemail@example.com',
          password: 'testpassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('testSalt');
      bcrypt.hash.mockResolvedValue('testHashedPassword');
      User.prototype.save.mockRejectedValue(new Error('saving error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error registering user: saving error',
      });
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const req = {
        body: {
          email: 'testuser@example.com',
          password: 'testpassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = { _id: 'userId123', password: 'hashedpassword' };

      // Mock 数据库查找操作、密码比较和 JWT 生成
      User.findOne.mockResolvedValue(mockUser); // 假设用户存在
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockedToken');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({ token: 'mockedToken' });
    });

    it('password incorrect', async () => {
      const req = {
        body: {
          email: 'testemail@example.com',
          password: 'testpassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = {
        email: 'testemail@example.com',
        password: 'testpassword',
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email or password is incorrect',
      });
    });

    it('the user not exists', async () => {
      const req = {
        body: {
          email: 'testemail@example.com',
          password: 'testpassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email or password is incorrect',
      });
    });
    it('sign error', async () => {
      const req = {
        body: {
          email: 'testemail@example.com',
          password: 'testpassword',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockUser = {
        email: 'testemail@example.com',
        password: 'testpassword',
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation(() => {
        throw new Error('sign error');
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error logging in user: sign error',
      });
    });
  });
});
