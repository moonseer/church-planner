FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# We don't need to copy the source code here since we're using volumes
# COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Command to run the app in development mode with hot reloading
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4000"] 