import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import User, { IUser } from './models/User';
import eventRoutes from './routes/eventRoutes';
import serviceRoutes from './routes/serviceRoutes';
import eventTypeRoutes from './routes/eventTypeRoutes';
import { protect } from './middleware/auth';
import csurf from 'csurf';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

// Load environment variables
dotenv.config();

// Ensure JWT_SECRET is set
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET environment variable is not set!');
    throw new Error('JWT_SECRET environment variable is not set. This is a critical security issue.');
  }
  return secret;
};

// Connect to database
connectDB();

// Initialize express app
const app: Express = express();
const PORT = process.env.PORT || 8080;

// CORS configuration - more explicit configuration
app.use((req, res, next) => {
  // Get the allowed origin from environment or default to localhost:4000
  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:4000';
  
  // Set the specific origin instead of wildcard '*' when using credentials
  const origin = req.headers.origin;
  if (origin && (allowedOrigin === '*' || origin === allowedOrigin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
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
  origin: process.env.CORS_ORIGIN || 'http://localhost:4000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// CSRF protection middleware
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],  // Don't require CSRF for these methods
});

// Routes that don't need CSRF protection
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get('/api/auth/test', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Auth API is working' });
});

// Apply CSRF protection to all other routes
app.use((req, res, next) => {
  // Skip CSRF for login and register routes
  if (req.path === '/api/auth/login' || req.path === '/api/auth/register') {
    return next();
  }
  // Apply CSRF protection
  csrfProtection(req, res, next);
});

// Routes
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the status of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */

/**
 * @swagger
 * /api/csrf-token:
 *   get:
 *     summary: Get CSRF token
 *     description: Returns a CSRF token for use in subsequent requests
 *     tags: [Security]
 *     responses:
 *       200:
 *         description: CSRF token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 csrfToken:
 *                   type: string
 */

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: Test auth API
 *     description: Tests if the auth API is working
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Auth API is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Auth API is working
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns user data with a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Missing email or password
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     description: Registers a new user and returns user data with a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - churchName
 *             properties:
 *               name:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               churchName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields or email already in use
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Returns the currently authenticated user's data
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *       - csrfToken: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: User logout
 *     description: Logs out the current user by clearing the token cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Server error
 */

// Auth routes
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
        getJwtSecret(),
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

      // Set JWT token as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      res.status(200).json({
        success: true,
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
      getJwtSecret(),
      { expiresIn: '1d' }
    );

    // Set JWT token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(201).json({
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

// Logout route
app.get('/api/auth/logout', (req: Request, res: Response) => {
  try {
    // Clear the token cookie
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
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

// Swagger API Documentation
console.log('Setting up Swagger UI at /api-docs');

// Serve Swagger UI with a safer approach
const swaggerServe = swaggerUi.serve;
const swaggerSetup = swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestDuration: true
  }
});

// Middleware to log Swagger requests
app.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
  console.log(`Swagger docs request received: ${req.method} ${req.url}`);
  next();
});

// Apply Swagger UI middleware
app.use('/api-docs', swaggerServe);
app.get('/api-docs', swaggerSetup);

// Static API Documentation Fallback
app.get('/api-docs-fallback', (req: Request, res: Response) => {
  console.log('Fallback API docs accessed');
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
        
        <div class="endpoint">
          <p><span class="method">POST</span> <span class="url">/api/event-types</span></p>
          <p>Creates a new event type.</p>
          <pre>
{
  "name": "Sunday Service",
  "code": "sunday-service",
  "color": "#3498db",
  "icon": "church"
}
          </pre>
        </div>
        
        <h2>Events</h2>
        
        <div class="endpoint">
          <p><span class="method">GET</span> <span class="url">/api/events/:churchId</span></p>
          <p>Returns all events for a specific church.</p>
        </div>
        
        <div class="endpoint">
          <p><span class="method">POST</span> <span class="url">/api/events/:churchId</span></p>
          <p>Creates a new event.</p>
          <pre>
{
  "title": "Sunday Service",
  "date": "2023-01-15",
  "time": "10:00 AM",
  "eventTypeId": "60d0fe4f5311236168a109cc",
  "status": "published",
  "description": "Regular Sunday worship service",
  "location": "Main Sanctuary",
  "organizer": "Pastor John"
}
          </pre>
        </div>
        
        <h2>Services</h2>
        
        <div class="endpoint">
          <p><span class="method">GET</span> <span class="url">/api/services/:churchId</span></p>
          <p>Returns all services for a specific church.</p>
        </div>
        
        <div class="endpoint">
          <p><span class="method">POST</span> <span class="url">/api/services/:churchId</span></p>
          <p>Creates a new service.</p>
          <pre>
{
  "title": "Sunday Morning Worship",
  "date": "2023-01-15",
  "time": "10:00 AM",
  "items": [
    {
      "id": "item-1",
      "type": "song",
      "title": "Amazing Grace",
      "duration": 5,
      "assignedTo": "Worship Leader"
    },
    {
      "id": "item-2",
      "type": "prayer",
      "title": "Opening Prayer",
      "duration": 3,
      "assignedTo": "Pastor John"
    }
  ]
}
          </pre>
        </div>
        
        <p><em>This is a static fallback documentation. For full interactive documentation, try accessing <a href="/api-docs">/api-docs</a>.</em></p>
      </body>
    </html>
  `);
});

// Add a simple HTML test route
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
        <p>Try accessing the <a href="/api-docs">API documentation</a> or the <a href="/api-docs-fallback">fallback documentation</a>.</p>
      </body>
    </html>
  `);
});

// Start server
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} and bound to all interfaces`);
  console.log(`Swagger API Documentation available at: http://localhost:${PORT}/api-docs`);
}); 