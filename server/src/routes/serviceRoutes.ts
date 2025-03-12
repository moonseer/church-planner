import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  seedServices
} from '../controllers/serviceController';

const router = express.Router();

// Define routes
// Get all services for a church
router.get('/services/:churchId', getServices);

// Get a single service
router.get('/services/:id', getService);

// Create a new service
router.post('/services/:churchId', createService);

// Update a service
router.put('/services/:id', updateService);

// Delete a service
router.delete('/services/:id', deleteService);

// Seed services (for development/testing)
router.post('/services/:churchId/seed', seedServices);

export default router; 