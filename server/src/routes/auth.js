const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { auth } = require('../middleware/auth');

// Mock user data (replace with database in production)
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2a$10$yCfBzM9Jb.NZPG3ERhGK3eQB.qWlMIHBzCvUxZ.kJcnFr5q9C5LIe', // "password"
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    resetPasswordToken: null,
    resetPasswordExpires: null
  }
];

// Mock token storage (replace with database in production)
const resetTokens = [];

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('firstName', 'First name is required').not().isEmpty(),
    body('lastName', 'Last name is required').not().isEmpty()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    try {
      // Check if user already exists
      const userExists = users.find(user => user.email === email);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'volunteer', // Default role
        resetPasswordToken: null,
        resetPasswordExpires: null
      };

      // Add user to mock database
      users.push(newUser);

      // Create JWT token
      const payload = {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: payload.user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user
      const user = users.find(user => user.email === email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Update last login
      user.lastLogin = new Date();

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: payload.user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post(
  '/forgot-password',
  [
    body('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      // Find user
      const user = users.find(user => user.email === email);
      if (!user) {
        // For security reasons, don't reveal that the user doesn't exist
        return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpires = Date.now() + 3600000; // 1 hour

      // Store token in user object
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpires;

      // In a real application, send an email with the reset link
      // For this example, we'll just return the token
      console.log(`Reset token for ${email}: ${resetToken}`);

      res.status(200).json({ 
        message: 'If an account with that email exists, a password reset link has been sent.',
        // Only include token in development for testing
        ...(process.env.NODE_ENV === 'development' && { resetToken })
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post(
  '/reset-password/:token',
  [
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('confirmPassword', 'Passwords must match').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;
    const { token } = req.params;

    try {
      // Find user with the reset token
      const user = users.find(
        user => user.resetPasswordToken === token && user.resetPasswordExpires > Date.now()
      );

      if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user password
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
  try {
    // Find user by ID
    const user = users.find(user => user.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data without password
    const { password, resetPasswordToken, resetPasswordExpires, ...userData } = user;
    
    res.json(userData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    auth,
    body('firstName', 'First name is required').not().isEmpty(),
    body('lastName', 'Last name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, bio, phoneNumber, preferences } = req.body;

    try {
      // Find user
      const user = users.find(user => user.id === req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if email is already in use by another user
      const emailInUse = users.find(u => u.email === email && u.id !== req.user.id);
      if (emailInUse) {
        return res.status(400).json({ message: 'Email is already in use' });
      }

      // Update user profile
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.bio = bio || user.bio;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.preferences = preferences || user.preferences;
      user.updatedAt = new Date();

      // Return updated user data without password
      const { password, resetPasswordToken, resetPasswordExpires, ...userData } = user;
      
      res.json(userData);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  '/change-password',
  [
    auth,
    body('currentPassword', 'Current password is required').exists(),
    body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 }),
    body('confirmPassword', 'Passwords must match').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      // Find user
      const user = users.find(user => user.id === req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password
      user.password = hashedPassword;
      user.updatedAt = new Date();

      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/auth/privacy-settings
// @desc    Update user privacy settings
// @access  Private
router.put(
  '/privacy-settings',
  auth,
  async (req, res) => {
    const { 
      showEmail, 
      showPhoneNumber, 
      showAddress,
      allowNotifications, 
      shareAvailability,
      dataRetentionPeriod,
      dataProcessingConsent,
      marketingConsent,
      thirdPartySharing
    } = req.body;

    try {
      // Find user
      const user = users.find(user => user.id === req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Initialize privacy settings if they don't exist
      if (!user.privacySettings) {
        user.privacySettings = {};
      }

      // Update privacy settings
      user.privacySettings = {
        ...user.privacySettings,
        ...(showEmail !== undefined && { showEmail }),
        ...(showPhoneNumber !== undefined && { showPhoneNumber }),
        ...(showAddress !== undefined && { showAddress }),
        ...(allowNotifications !== undefined && { allowNotifications }),
        ...(shareAvailability !== undefined && { shareAvailability }),
        ...(dataRetentionPeriod !== undefined && { dataRetentionPeriod }),
        ...(dataProcessingConsent !== undefined && { dataProcessingConsent }),
        ...(marketingConsent !== undefined && { marketingConsent }),
        ...(thirdPartySharing !== undefined && { thirdPartySharing })
      };

      // Update last privacy acceptance date if consent fields were updated
      if (
        dataProcessingConsent !== undefined || 
        marketingConsent !== undefined || 
        thirdPartySharing !== undefined
      ) {
        user.privacySettings.lastPrivacyAcceptanceDate = new Date();
      }

      user.updatedAt = new Date();

      res.json({
        message: 'Privacy settings updated successfully',
        privacySettings: user.privacySettings
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/data-export
// @desc    Request a data export (GDPR)
// @access  Private
router.post(
  '/data-export',
  auth,
  async (req, res) => {
    try {
      // Find user
      const user = users.find(user => user.id === req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Initialize data exports array if it doesn't exist
      if (!user.dataExports) {
        user.dataExports = [];
      }

      // Create new data export request
      const dataExport = {
        requestDate: new Date(),
        status: 'requested'
      };

      // Add to user's data exports
      user.dataExports.push(dataExport);
      user.updatedAt = new Date();

      // In a real application, we would queue a job to generate the export
      // For this example, we'll just return a success message
      res.json({
        message: 'Data export request received. You will be notified when it is ready.',
        requestDate: dataExport.requestDate
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/data-deletion
// @desc    Request account deletion (GDPR)
// @access  Private
router.post(
  '/data-deletion',
  auth,
  async (req, res) => {
    try {
      // Find user
      const user = users.find(user => user.id === req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Initialize deletion requests array if it doesn't exist
      if (!user.deletionRequests) {
        user.deletionRequests = [];
      }

      // Calculate scheduled deletion date (30 days from now)
      const scheduledDeletionDate = new Date();
      scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + 30);

      // Create new deletion request
      const deletionRequest = {
        requestDate: new Date(),
        scheduledDeletionDate,
        status: 'scheduled'
      };

      // Add to user's deletion requests
      user.deletionRequests.push(deletionRequest);
      user.updatedAt = new Date();

      // In a real application, we would queue a job to delete the account after the waiting period
      // For this example, we'll just return a success message
      res.json({
        message: 'Account deletion request received. Your account will be deleted after 30 days.',
        scheduledDeletionDate
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/cancel-deletion
// @desc    Cancel account deletion request
// @access  Private
router.post(
  '/cancel-deletion',
  auth,
  async (req, res) => {
    try {
      // Find user
      const user = users.find(user => user.id === req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user has any pending deletion requests
      if (!user.deletionRequests || user.deletionRequests.length === 0) {
        return res.status(400).json({ message: 'No pending deletion requests found' });
      }

      // Find the most recent scheduled deletion request
      const pendingRequest = [...user.deletionRequests]
        .reverse()
        .find(req => req.status === 'scheduled');

      if (!pendingRequest) {
        return res.status(400).json({ message: 'No pending deletion requests found' });
      }

      // Update the request status to cancelled
      pendingRequest.status = 'cancelled';
      user.updatedAt = new Date();

      res.json({
        message: 'Account deletion request has been cancelled.',
        deletionRequests: user.deletionRequests
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router; 