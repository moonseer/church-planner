import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { login, register } from '../controllers/authController';

// Mock the User model
const mockUser = {
  _id: 'user123',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  churchName: 'Test Church',
  role: 'user',
  comparePassword: jest.fn(),
  generateAuthToken: jest.fn().mockReturnValue('mock-token'),
  save: jest.fn().mockResolvedValue(true),
};

jest.mock('../models/User', () => ({
  findOne: jest.fn(),
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn(),
}));

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {
      body: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  
  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      // Call the login function
      await login(req as Request, res as Response);
      
      // Check response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('email and password'),
      });
    });
    
    it('should return 401 if user is not found', async () => {
      // Setup
      req.body = { email: 'test@example.com', password: 'password123' };
      const User = require('../models/User');
      User.findOne = jest.fn().mockResolvedValue(null);
      
      // Call the login function
      await login(req as Request, res as Response);
      
      // Check response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Invalid credentials'),
      });
    });
    
    it('should return 401 if password is incorrect', async () => {
      // Setup
      req.body = { email: 'test@example.com', password: 'password123' };
      const User = require('../models/User');
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(false);
      
      // Call the login function
      await login(req as Request, res as Response);
      
      // Check response
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Invalid credentials'),
      });
    });
    
    it('should return 200 with token and user data if login is successful', async () => {
      // Setup
      req.body = { email: 'test@example.com', password: 'password123' };
      const User = require('../models/User');
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);
      
      // Call the login function
      await login(req as Request, res as Response);
      
      // Check response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'mock-token',
        user: expect.objectContaining({
          id: mockUser._id,
          name: mockUser.name,
        }),
      });
    });
  });
  
  describe('register', () => {
    it('should return 400 if required fields are missing', async () => {
      // Call the register function
      await register(req as Request, res as Response);
      
      // Check response
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('required'),
      });
    });
    
    // Add more tests for registration functionality
  });
}); 