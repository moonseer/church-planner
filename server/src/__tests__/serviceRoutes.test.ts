import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import serviceRoutes from '../routes/serviceRoutes';
import { auth } from '../middleware/auth';

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = {
      _id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
    };
    next();
  }),
}));

// Mock the Service model
const mockServices = [
  {
    _id: 'service1',
    title: 'Sunday Service',
    date: new Date('2023-06-01'),
    description: 'Regular Sunday service',
    teams: ['worship', 'tech'],
    createdBy: 'user123',
  },
  {
    _id: 'service2',
    title: 'Midweek Service',
    date: new Date('2023-06-05'),
    description: 'Midweek prayer service',
    teams: ['prayer'],
    createdBy: 'user123',
  },
];

jest.mock('../models/Service', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
}));

// Create express app for testing
const app = express();
app.use(express.json());
app.use('/api/services', serviceRoutes);

describe('Service Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /api/services', () => {
    it('should return all services', async () => {
      // Setup
      const Service = require('../models/Service');
      Service.find = jest.fn().mockResolvedValue(mockServices);
      
      // Make request
      const response = await request(app).get('/api/services');
      
      // Check response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.services).toHaveLength(2);
      expect(response.body.services[0].title).toBe('Sunday Service');
      expect(auth).toHaveBeenCalled();
    });
    
    it('should handle errors', async () => {
      // Setup
      const Service = require('../models/Service');
      Service.find = jest.fn().mockRejectedValue(new Error('Database error'));
      
      // Make request
      const response = await request(app).get('/api/services');
      
      // Check response
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Error');
    });
  });
  
  describe('GET /api/services/:id', () => {
    it('should return a specific service', async () => {
      // Setup
      const Service = require('../models/Service');
      Service.findById = jest.fn().mockResolvedValue(mockServices[0]);
      
      // Make request
      const response = await request(app).get('/api/services/service1');
      
      // Check response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.service.title).toBe('Sunday Service');
      expect(auth).toHaveBeenCalled();
    });
    
    it('should return 404 if service is not found', async () => {
      // Setup
      const Service = require('../models/Service');
      Service.findById = jest.fn().mockResolvedValue(null);
      
      // Make request
      const response = await request(app).get('/api/services/nonexistent');
      
      // Check response
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });
  
  describe('POST /api/services', () => {
    it('should create a new service', async () => {
      // Setup
      const newService = {
        title: 'New Service',
        date: '2023-06-10',
        description: 'A new service',
        teams: ['worship'],
      };
      
      const createdService = {
        ...newService,
        _id: 'service3',
        createdBy: 'user123',
      };
      
      const Service = require('../models/Service');
      Service.create = jest.fn().mockResolvedValue(createdService);
      
      // Make request
      const response = await request(app)
        .post('/api/services')
        .send(newService);
      
      // Check response
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.service.title).toBe('New Service');
      expect(Service.create).toHaveBeenCalledWith({
        ...newService,
        createdBy: 'user123',
      });
    });
    
    it('should return 400 if required fields are missing', async () => {
      // Make request with missing fields
      const response = await request(app)
        .post('/api/services')
        .send({ title: 'Incomplete Service' });
      
      // Check response
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });
  });
  
  // Add tests for PUT and DELETE routes
}); 