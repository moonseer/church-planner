FROM node:18-alpine

WORKDIR /app

# Install bash for running shell scripts
RUN apk add --no-cache bash

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install ts-node globally for running TypeScript scripts
RUN npm install -g ts-node

# Copy the rest of the server code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app in development mode
# This will be overridden by the command in docker-compose.yml
CMD ["npm", "run", "dev"] 