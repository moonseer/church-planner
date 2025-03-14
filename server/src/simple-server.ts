import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';

// Load env vars
dotenv.config();

// Connect to database function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/church-planner');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Call connectDB
connectDB();

// Initialize express
const app: Express = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  console.log('Health check accessed');
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Test HTML route
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
        <p>This is a test page to confirm the server is operational.</p>
      </body>
    </html>
  `);
});

// API Documentation route
app.get('/api-docs', (req: Request, res: Response) => {
  console.log('API Documentation route accessed');
  res.sendFile(path.join(__dirname, 'public', 'api-docs.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡️ Server is running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🔍 Health check available at http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test HTML available at http://localhost:${PORT}/test-html`);
}); 