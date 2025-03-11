import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth';

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

// Mock User model
jest.mock('../models/User', () => ({
  findById: jest.fn(),
}));

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request, response, and next function
    req = {
      header: jest.fn(),
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    next = jest.fn();
  });
  
  it('should return 401 if no token is provided', async () => {
    // Setup
    req.header = jest.fn().mockReturnValue(undefined);
    
    // Call the middleware
    await auth(req as Request, res as Response, next);
    
    // Check response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('No token'),
    });
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should return 401 if token is invalid', async () => {
    // Setup
    req.header = jest.fn().mockReturnValue('Bearer invalid-token');
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    // Call the middleware
    await auth(req as Request, res as Response, next);
    
    // Check response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('Invalid token'),
    });
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should return 401 if user is not found', async () => {
    // Setup
    req.header = jest.fn().mockReturnValue('Bearer valid-token');
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'user123' });
    const User = require('../models/User');
    User.findById = jest.fn().mockResolvedValue(null);
    
    // Call the middleware
    await auth(req as Request, res as Response, next);
    
    // Check response
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('User not found'),
    });
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should set req.user and call next if token is valid', async () => {
    // Setup
    const mockUser = {
      _id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
    };
    
    req.header = jest.fn().mockReturnValue('Bearer valid-token');
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'user123' });
    const User = require('../models/User');
    User.findById = jest.fn().mockResolvedValue(mockUser);
    
    // Call the middleware
    await auth(req as Request, res as Response, next);
    
    // Check that user was set and next was called
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
}); 