#!/bin/bash

# Don't exit on error, so we can run all tests even if some fail
set +e

echo "=== Church Planner Test Runner ==="
echo "Installing dependencies..."

# Install root dependencies
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install --save-dev @types/jest
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom @types/node
cd ..

# Run server tests
echo "Running server tests..."
cd server
npm test
SERVER_EXIT_CODE=$?
cd ..

# Run client tests
echo "Running client tests..."
cd client
npm test
CLIENT_EXIT_CODE=$?
cd ..

# Report results
echo ""
echo "=== Test Results ==="
if [ $SERVER_EXIT_CODE -eq 0 ]; then
  echo "✅ Server tests: PASSED"
else
  echo "❌ Server tests: FAILED (exit code $SERVER_EXIT_CODE)"
fi

if [ $CLIENT_EXIT_CODE -eq 0 ]; then
  echo "✅ Client tests: PASSED"
else
  echo "❌ Client tests: FAILED (exit code $CLIENT_EXIT_CODE)"
fi

# Overall status
if [ $SERVER_EXIT_CODE -eq 0 ] && [ $CLIENT_EXIT_CODE -eq 0 ]; then
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ Some tests failed. See above for details."
  exit 1
fi 