import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose, { Document } from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from './config/database';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app: Express = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4000',
  credentials: true
}));
app.use(express.json());

// Define User interface
interface IUser extends Document {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  churchName: string;
  role: 'admin' | 'user' | 'volunteer';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  churchName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'volunteer'], default: 'user' }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function(): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET environment variable is not set!');
    throw new Error('JWT_SECRET environment variable is not set. This is a critical security issue.');
  }
  
  return jwt.sign(
    { id: this._id, name: this.name, email: this.email, role: this.role },
    jwtSecret,
    { expiresIn: '1d' }
  );
};

// Create User model
const User = mongoose.model<IUser>('User', UserSchema);

// Auth middleware
const protect = async (req: any, res: any, next: any) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET environment variable is not set!');
        throw new Error('JWT_SECRET environment variable is not set. This is a critical security issue.');
      }
      
      const decoded = jwt.verify(token, jwtSecret) as any;
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Routes
// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Test route
app.get('/test-html', (req: Request, res: Response) => {
  console.log('Test HTML route accessed');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Server Test</title>
      </head>
      <body>
        <h1>Server is working!</h1>
        <p>This confirms the server is running and can serve HTML content.</p>
      </body>
    </html>
  `);
});

// Static documentation route
app.get('/api-docs', (req: Request, res: Response) => {
  console.log('API docs accessed');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Church Planner API Documentation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1000px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          h2 { color: #444; margin-top: 30px; }
          .endpoint { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .method { font-weight: bold; color: #0066cc; }
          .url { font-family: monospace; }
          pre { background: #f9f9f9; padding: 10px; border-radius: 5px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <h1>Church Planner API Documentation</h1>
        <p>This is a simplified documentation for the Church Planner API.</p>
        
        <h2>Authentication</h2>
        
        <div class="endpoint">
          <p><span class="method">POST</span> <span class="url">/api/auth/login</span></p>
          <p>Authenticates a user and returns user data with a token.</p>
          <pre>
{
  "email": "user@example.com",
  "password": "password123"
}
          </pre>
        </div>
        
        <div class="endpoint">
          <p><span class="method">POST</span> <span class="url">/api/auth/register</span></p>
          <p>Registers a new user and returns user data with a token.</p>
          <pre>
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "churchName": "First Baptist Church"
}
          </pre>
        </div>
        
        <div class="endpoint">
          <p><span class="method">GET</span> <span class="url">/api/auth/me</span></p>
          <p>Returns the currently authenticated user's data.</p>
        </div>
        
        <div class="endpoint">
          <p><span class="method">GET</span> <span class="url">/api/auth/logout</span></p>
          <p>Logs out the current user by clearing the token cookie.</p>
        </div>
        
        <h2>Event Types</h2>
        
        <div class="endpoint">
          <p><span class="method">GET</span> <span class="url">/api/event-types</span></p>
          <p>Returns all event types for the current church.</p>
        </div>
      </body>
    </html>
  `);
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, firstName, lastName, email, password, churchName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Create new user
    const user = await User.create({
      name,
      firstName,
      lastName,
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        churchName: user.churchName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(200).json({
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
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', protect, (req: any, res) => {
  try {
    const user = req.user;

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

// Start server
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Minimal server running on port ${PORT} and bound to all interfaces`);
  console.log(`Test HTML available at: http://localhost:${PORT}/test-html`);
  console.log(`API Documentation available at: http://localhost:${PORT}/api-docs`);
}); 