const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const churchController = require('../controllers/churchController');
const { auth, admin, leader, churchMember } = require('../middleware/auth');

// @route   GET api/churches
// @desc    Get all churches
// @access  Private/Admin
router.get('/', [auth, admin], churchController.getChurches);

// @route   GET api/churches/:id
// @desc    Get church by ID
// @access  Private
router.get('/:id', [auth, churchMember], churchController.getChurchById);

// @route   POST api/churches
// @desc    Create a church
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    admin,
    body('name', 'Name is required').not().isEmpty(),
    body('address.street', 'Street address is required').not().isEmpty(),
    body('address.city', 'City is required').not().isEmpty(),
    body('address.state', 'State is required').not().isEmpty(),
    body('address.zipCode', 'Zip code is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail()
  ],
  churchController.createChurch
);

// @route   PUT api/churches/:id
// @desc    Update church
// @access  Private/Leader
router.put(
  '/:id',
  [
    auth,
    leader,
    body('name', 'Name is required if provided').optional().not().isEmpty(),
    body('email', 'Please include a valid email if provided').optional().isEmail()
  ],
  churchController.updateChurch
);

// @route   DELETE api/churches/:id
// @desc    Delete church
// @access  Private/Admin
router.delete('/:id', [auth, admin], churchController.deleteChurch);

// @route   PUT api/churches/:id/service-schedule
// @desc    Update church service schedule
// @access  Private/Leader
router.put(
  '/:id/service-schedule',
  [
    auth,
    leader,
    body('serviceSchedule', 'Service schedule is required').isArray(),
    body('serviceSchedule.*.day', 'Day is required for each service').not().isEmpty(),
    body('serviceSchedule.*.startTime', 'Start time is required for each service').not().isEmpty(),
    body('serviceSchedule.*.endTime', 'End time is required for each service').not().isEmpty(),
    body('serviceSchedule.*.name', 'Name is required for each service').not().isEmpty()
  ],
  churchController.updateServiceSchedule
);

// @route   PUT api/churches/:id/ministries
// @desc    Update church ministries
// @access  Private/Leader
router.put(
  '/:id/ministries',
  [
    auth,
    leader,
    body('ministries', 'Ministries is required').isArray(),
    body('ministries.*.name', 'Name is required for each ministry').not().isEmpty()
  ],
  churchController.updateMinistries
);

// @route   PUT api/churches/:id/settings
// @desc    Update church settings
// @access  Private/Leader
router.put(
  '/:id/settings',
  [auth, leader],
  churchController.updateSettings
);

module.exports = router; 