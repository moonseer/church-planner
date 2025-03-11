import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Mock bcrypt and jwt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-token'),
}));

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to a test database or mock the connection
    // This is optional if you're mocking all database operations
  });

  afterAll(async () => {
    // Disconnect from the test database
    // This is optional if you're mocking all database operations
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Schema Validation', () => {
    it('should validate a user with all required fields', () => {
      const validUser = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        churchName: 'Test Church',
        role: 'admin',
      });

      const validationError = validUser.validateSync();
      expect(validationError).toBeUndefined();
    });

    it('should invalidate a user with missing required fields', () => {
      const invalidUser = new User({
        firstName: 'John',
        // Missing lastName, email, password, churchName
      });

      const validationError = invalidUser.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError?.errors.lastName).toBeDefined();
      expect(validationError?.errors.email).toBeDefined();
      expect(validationError?.errors.password).toBeDefined();
      expect(validationError?.errors.churchName).toBeDefined();
    });

    it('should invalidate a user with an invalid email', () => {
      const invalidUser = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123',
        churchName: 'Test Church',
      });

      const validationError = invalidUser.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError?.errors.email).toBeDefined();
    });
  });

  describe('User Methods', () => {
    it('should compare password correctly', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        churchName: 'Test Church',
      });

      // Mock bcrypt.compare to return true for correct password
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      const result = await user.comparePassword('password123');
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);

      // Mock bcrypt.compare to return false for incorrect password
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      const result2 = await user.comparePassword('wrongpassword');
      expect(result2).toBe(false);
    });

    it('should generate auth token correctly', () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId('5f7d7e1c8f3d4e1a2c3b4a5d'),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        churchName: 'Test Church',
      });

      const token = user.generateAuthToken();
      expect(token).toBe('mock-token');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
    });
  });

  describe('User Pre-save Hook', () => {
    it('should hash password before saving', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        churchName: 'Test Church',
      });

      // Mock the save method to avoid actual database operations
      const originalSave = user.save;
      user.save = jest.fn().mockResolvedValue(user);

      // Trigger the pre-save hook
      await user.save();

      // Verify that bcrypt.genSalt and bcrypt.hash were called
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      
      // Restore the original save method
      user.save = originalSave;
    });

    it('should not hash password if it has not been modified', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        churchName: 'Test Church',
      });

      // Set isModified to return false
      user.isModified = jest.fn().mockReturnValue(false);

      // Mock the save method to avoid actual database operations
      const originalSave = user.save;
      user.save = jest.fn().mockResolvedValue(user);

      // Trigger the pre-save hook
      await user.save();

      // Verify that bcrypt functions were not called
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      
      // Restore the original save method
      user.save = originalSave;
    });
  });
}); 