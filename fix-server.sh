#!/bin/bash

# Make this script executable
chmod +x fix-server.sh

# Stop the containers
echo "Stopping containers..."
./docker-commands.sh dev-down

# Add nodemon to the server's package.json if not already there
echo "Updating package.json..."
if ! grep -q '"nodemon":' ./server/package.json; then
  sed -i '' 's/"jest": "\^29.5.0",/"jest": "\^29.5.0",\n    "nodemon": "\^3.0.1",/g' ./server/package.json
fi

# Update the Dockerfile to install nodemon globally
echo "Updating Dockerfile..."
sed -i '' 's/RUN npm install -g ts-node/RUN npm install -g ts-node nodemon/g' ./server/server/Dockerfile

# Start the containers
echo "Starting containers..."
./docker-commands.sh dev-up

echo "Done! The server should now start properly." 