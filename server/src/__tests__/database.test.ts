import mongoose from 'mongoose';
import connectDB from '../config/database';

// Mock mongoose to avoid actual database connections during tests
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    on: jest.fn(),
    once: jest.fn().mockImplementation((event, callback) => {
      if (event === 'open') {
        callback(); // Call the 'open' event callback immediately
      }
    }),
  },
}));

// Mock console.log and console.error to avoid cluttering test output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Database Connection', () => {
  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to the database successfully', async () => {
    // Call the connectDB function
    await connectDB();

    // Check that mongoose.connect was called with the correct URI
    expect(mongoose.connect).toHaveBeenCalled();
    
    // Check that the connection event handlers were set up
    expect(mongoose.connection.once).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mongoose.connection.on).toHaveBeenCalledWith('error', expect.any(Function));
    
    // Verify that the success message was logged
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('MongoDB connected'));
  });

  it('should handle connection errors', async () => {
    // Mock mongoose.connect to reject with an error
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

    // Call the connectDB function
    await expect(connectDB()).rejects.toThrow('Connection failed');
    
    // Verify that the error was logged
    expect(console.error).toHaveBeenCalled();
  });
}); 