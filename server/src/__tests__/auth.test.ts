import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock the User model
const mockUserFindOne = jest.fn();
const mockUserFindById = jest.fn();

jest.mock('../models/User', () => ({
  findOne: mockUserFindOne,
  findById: mockUserFindById
}));

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRE = '1h';

describe('Authentication Utilities', () => {
  describe('JWT Token', () => {
    it('should generate and verify a JWT token', () => {
      // Create a payload
      const payload = { id: '123', name: 'Test User' };
      
      // Generate a token
      const token = jwt.sign(payload, process.env.JWT_SECRET || '');
      
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
      
      // Check that the decoded token matches the payload
      expect(decoded.id).toBe(payload.id);
      expect(decoded.name).toBe(payload.name);
    });
  });
  
  describe('Password Hashing', () => {
    it('should hash and verify a password', async () => {
      // Create a password
      const password = 'password123';
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Verify the password
      const isMatch = await bcrypt.compare(password, hashedPassword);
      
      // Check that the password matches
      expect(isMatch).toBe(true);
      
      // Check that an incorrect password doesn't match
      const isNotMatch = await bcrypt.compare('wrongpassword', hashedPassword);
      expect(isNotMatch).toBe(false);
    });
  });
}); 