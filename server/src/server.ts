import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User, { IUser } from './models/User';
import eventRoutes from './routes/eventRoutes';
import serviceRoutes from './routes/serviceRoutes';
import eventTypeRoutes from './routes/eventTypeRoutes';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app: Express = express();
const PORT = process.env.PORT || 8080;

// CORS configuration - more explicit configuration
app.use((req, res, next) => {
  // Set CORS headers manually for all responses
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Still use cors middleware as a fallback
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Auth middleware
const protect = async (req: Request, res: Response, next: Function) => {
  try {
    console.log('Auth middleware called for URL:', req.url);
    console.log('Auth headers:', req.headers.authorization);
    
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted from Authorization header:', token.substring(0, 10) + '...');
    }

    if (!token) {
      console.log('No token found in request');
      res.status(401).json({ success: false, message: 'Not authorized to access this route' });
      return;
    }

    try {
      // Verify token
      console.log('Verifying token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      console.log('Token decoded successfully:', decoded);

      // Find user by id
      console.log('Finding user with ID:', decoded.id);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        console.log('User not found with ID:', decoded.id);
        res.status(401).json({ success: false, message: 'User not found' });
        return;
      }

      console.log('User found:', user._id.toString());
      
      // Attach user to request
      (req as any).user = user;
      next();
    } catch (error) {
      console.error('Error in token verification:', error);
      res.status(401).json({ success: false, message: 'Not authorized to access this route' });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Routes
// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Auth routes
// Test route
app.get('/api/auth/test', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Auth API is working' });
});

// Login route
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    console.log('Login attempt with:', { email: req.body.email });
    console.log('Request body:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    console.log('Looking for user with email:', email);
    
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found:', email);
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    console.log('User found:', {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      hasPassword: !!user.password
    });
    
    try {
      // Check password
      console.log('Comparing password...');
      const isPasswordCorrect = await user.comparePassword(password);
      console.log('Password comparison result:', isPasswordCorrect);
      
      if (!isPasswordCorrect) {
        console.log('Password incorrect');
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      console.log('Password correct, generating token...');
      
      // Generate JWT token manually instead of using the model method
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
      console.log('Token generated successfully');

      // Prepare user data for response
      const userData = {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        churchName: user.churchName,
        role: user.role,
      };
      
      console.log('Sending successful login response with user data:', userData);

      res.status(200).json({
        success: true,
        token,
        user: userData,
      });
    } catch (passwordError) {
      console.error('Password comparison error:', passwordError);
      res.status(500).json({ success: false, message: 'Error verifying credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register route
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, firstName, lastName, email, password, churchName } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !churchName) {
      res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: firstName, lastName, email, password, churchName' 
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already in use' });
      return;
    }

    // Create new user
    const user = await User.create({
      name: name || `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      password,
      churchName,
    });

    // Generate JWT token manually instead of using the model method
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      token,
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
    console.error('Registration error:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map((val: any) => val.message);
      res.status(400).json({ success: false, message: messages.join(', ') });
      return;
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current user route
app.get('/api/auth/me', protect, (req: Request, res: Response) => {
  try {
    const user = (req as any).user as IUser;

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

// Debug route to check environment
app.get('/api/debug', (req: Request, res: Response) => {
  res.status(200).json({
    environment: process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI?.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@'),
    corsOrigin: process.env.CORS_ORIGIN
  });
});

// Use event routes
app.use('/api', protect, eventRoutes);

// Use service routes
app.use('/api', protect, serviceRoutes);

// Use event type routes
app.use('/api/event-types', protect, (req: any, res, next) => {
  console.log('Event type routes middleware called');
  console.log('Request user:', req.user ? req.user._id : 'No user');
  console.log('Request params before:', req.params);
  
  // Extract churchId from user if available
  if (req.user) {
    // Use the user's _id as churchId since churchId doesn't exist on IUser
    req.params.churchId = req.user._id;
    console.log('Set churchId param to user._id:', req.user._id);
  }
  
  console.log('Request params after:', req.params);
  next();
}, eventTypeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 