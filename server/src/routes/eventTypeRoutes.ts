import express from 'express';
import {
  getEventTypes,
  getEventType,
  createEventType,
  updateEventType,
  deleteEventType,
  seedDefaultEventTypes,
  getEventTypeStats
} from '../controllers/eventTypeController';

const router = express.Router();

// Event type routes
router.route('/')
  .get(getEventTypes)
  .post(createEventType);

router.route('/seed')
  .post(seedDefaultEventTypes);

router.route('/:id')
  .get(getEventType)
  .put(updateEventType)
  .delete(deleteEventType);

router.route('/:id/stats')
  .get(getEventTypeStats);

export default router; 