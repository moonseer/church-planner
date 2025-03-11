// Set up environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/church-planner-test';

// Mock console methods to keep test output clean
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Add custom matchers if needed
// expect.extend({
//   // Custom matchers here
// });

// Global setup and teardown
beforeAll(() => {
  // Any setup that should run once before all tests
});

afterAll(() => {
  // Any cleanup that should run once after all tests
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
}); 