FROM node:18-alpine

WORKDIR /app

# Install bash for running shell scripts
RUN apk add --no-cache bash

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install ts-node globally for running TypeScript scripts
RUN npm install -g ts-node nodemon

# We don't need to copy the source code here since we're using volumes
# COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the app in development mode with hot reloading
CMD ["npm", "run", "dev"] 