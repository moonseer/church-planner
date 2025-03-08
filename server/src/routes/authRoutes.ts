import express from 'express';
import { register, login, requestPasswordReset, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes - commenting out for now until we fix the getCurrentUser function
// router.get('/me', protect, getCurrentUser);

export default router; 