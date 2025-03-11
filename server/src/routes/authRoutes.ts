import express from 'express';
import { protect } from '../middleware/auth';
import { testFunction } from '../controllers/testController';
import { register, login, requestPasswordReset, resetPassword } from '../controllers/newAuthController';

const router = express.Router();

// Test route
router.get('/test', testFunction);

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Define the getCurrentUser route inline
router.get('/me', protect, (req, res) => {
  try {
    // The user should be attached to the request by the auth middleware
    const user = req.user;

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        churchName: user.churchName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 