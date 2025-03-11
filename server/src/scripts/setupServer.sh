#!/bin/bash

# Make the script executable with: chmod +x setupServer.sh

# Create the test user
echo "Creating test user..."
npm run create-test-user

# Start the server
echo "Starting server..."
npm run dev 