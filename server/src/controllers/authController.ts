import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, churchName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already in use' });
      return;
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      churchName,
    });

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        churchName: user.churchName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        churchName: user.churchName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // The user should be attached to the request by the auth middleware
    const user = req.user as IUser;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        churchName: user.churchName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      res.status(200).json({ success: true, message: 'If your email exists in our system, you will receive a password reset link' });
      return;
    }

    // In a real application, you would:
    // 1. Generate a reset token and save it to the user document
    // 2. Send an email with a link containing the token
    
    // For this example, we'll just simulate success
    res.status(200).json({ success: true, message: 'If your email exists in our system, you will receive a password reset link' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    // In a real application, you would:
    // 1. Verify the token
    // 2. Find the user associated with the token
    // 3. Update the password
    
    // For this example, we'll just simulate success
    res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 