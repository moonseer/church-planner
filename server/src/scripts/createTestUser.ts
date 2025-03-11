import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/church-planner';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create test user
const createTestUser = async (): Promise<void> => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }
    
    // Create test user with all required fields
    const testUser = await User.create({
      name: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      churchName: 'Test Church',
      role: 'admin',
    });
    
    console.log('Test user created successfully:', {
      id: testUser._id,
      name: testUser.name,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
      churchName: testUser.churchName,
      role: testUser.role,
    });
  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

// Main function
const main = async (): Promise<void> => {
  await connectDB();
  await createTestUser();
  
  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
  
  process.exit(0);
};

// Run the script
main(); 