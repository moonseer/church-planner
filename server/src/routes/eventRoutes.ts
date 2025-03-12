import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  seedEvents
} from '../controllers/eventController';

const router = express.Router();

// Define routes
// Get all events for a church
router.get('/events/:churchId', getEvents);

// Get a single event
router.get('/events/:id', getEvent);

// Create a new event
router.post('/events/:churchId', createEvent);

// Update an event
router.put('/events/:id', updateEvent);

// Delete an event
router.delete('/events/:id', deleteEvent);

// Seed events (for development/testing)
router.post('/events/:churchId/seed', seedEvents);

export default router; 