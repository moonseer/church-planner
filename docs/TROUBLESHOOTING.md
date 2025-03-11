# Troubleshooting Guide

This document provides solutions for common issues you might encounter while setting up and running the Church Planner application.

## Server Connection Issues

### Issue: Server won't start due to port conflict

**Error message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

1. Find the process using port 5000:
   ```bash
   # Mac/Linux
   lsof -i :5000
   
   # Windows
   netstat -ano | findstr :5000
   ```

2. Kill the process:
   ```bash
   # Mac/Linux
   kill -9 <PID>
   
   # Windows
   taskkill /PID <PID> /F
   ```

3. Alternatively, change the port in the `.env` file:
   ```
   PORT=5001
   ```
   
   Remember to update the CORS settings if you change the server port:
   ```
   CORS_ORIGIN=http://localhost:4000
   ```

### Issue: "getCurrentUser is not defined" error

**Error message:**
```
Error: Route.get() requires a callback function but got a [object Undefined]
```

**Solution:**

1. Edit the `server/src/routes/authRoutes.ts` file:
   ```typescript
   // Comment out the problematic route
   // router.get('/me', protect, getCurrentUser);
   ```

2. Restart the server

## MongoDB Connection Issues

### Issue: Cannot connect to MongoDB

**Error message:**
```
MongoNetworkError: failed to connect to server
```

**Solution:**

1. Check if MongoDB is running:
   ```bash
   # Mac/Linux
   ps aux | grep mongod
   
   # Windows
   tasklist | findstr mongod
   ```

2. Start MongoDB if it's not running:
   ```bash
   # Mac (Homebrew)
   brew services start mongodb/brew/mongodb-community
   
   # Windows
   net start MongoDB
   
   # Linux
   sudo systemctl start mongod
   ```

3. Verify MongoDB connection:
   ```bash
   mongosh
   ```

4. Check your connection string in the `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/church-planner
   ```

## Client-Side Issues

### Issue: "No response from server" during registration or login

**Error message:**
```
Registration failed: No response from server. Please check if the server is running.
```

**Solution:**

1. Make sure the server is running on the correct port (default: 5000)
2. Check that the client is making requests to the correct server URL:
   - Open browser developer tools (F12)
   - Go to the Network tab
   - Attempt to register/login and check the request URL
   - It should be `http://localhost:5000/api/auth/register` or `http://localhost:5000/api/auth/login`

3. Check for CORS issues:
   - In the server's `.env` file, make sure `CORS_ORIGIN` is set to the client's URL:
     ```
     CORS_ORIGIN=http://localhost:4000
     ```

### Issue: Client shows blank page

**Solution:**

1. Check for JavaScript errors in the browser console (F12)
2. Make sure all required dependencies are installed:
   ```bash
   cd client && npm install
   ```
3. Restart the client development server:
   ```bash
   cd client && npm run dev -- --port 4000
   ```

## Package Installation Issues

### Issue: npm install fails with dependency errors

**Solution:**

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   ```

3. Reinstall dependencies:
   ```bash
   npm install
   ```

4. If specific packages are causing issues, try installing them individually:
   ```bash
   npm install <package-name>
   ```

## Environment Setup Issues

### Issue: TypeScript compilation errors

**Solution:**

1. Make sure TypeScript is installed:
   ```bash
   npm install -g typescript
   ```

2. Check your `tsconfig.json` file for proper configuration
3. Run TypeScript compiler to see specific errors:
   ```bash
   tsc --noEmit
   ```

### Issue: Missing .env file or environment variables

**Solution:**

1. Create a `.env` file in the server directory:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Make sure all required environment variables are set in the `.env` file

## Docker Issues

### Issue: Container fails to start

**Error message:**
```
Error response from daemon: driver failed programming external connectivity on endpoint
```

**Solution:**

1. Check if another container is using the same port:
   ```bash
   docker ps -a
   ```

2. Stop and remove conflicting containers:
   ```bash
   docker stop <container_id>
   docker rm <container_id>
   ```

3. Restart Docker:
   ```bash
   # Mac
   osascript -e 'quit app "Docker"'
   open -a Docker
   
   # Windows
   Restart Docker Desktop
   
   # Linux
   sudo systemctl restart docker
   ```

### Issue: Volume mounting issues

**Error message:**
```
Error response from daemon: invalid mount config for type "bind": bind source path does not exist
```

**Solution:**

1. Make sure the source path exists on your host machine
2. Use absolute paths in your docker-compose.yml file
3. Check file permissions on the host directory

### Issue: Changes not reflecting in development

**Problem:**
You make changes to your code, but they don't appear in the running application.

**Solution:**

1. Make sure volume mounting is working correctly:
   ```bash
   # Check the container's file system
   docker exec -it church-planner-client ls -la /app
   ```

2. Restart the container:
   ```bash
   ./docker-commands.sh dev-down
   ./docker-commands.sh dev-up
   ```

3. Check if the development server is watching for changes:
   ```bash
   # View logs to see if file changes are detected
   docker logs church-planner-client
   ```

### Issue: MongoDB connection fails in Docker

**Error message:**
```
MongoNetworkError: failed to connect to server [mongodb:27017]
```

**Solution:**

1. Make sure the MongoDB container is running:
   ```bash
   docker ps | grep mongodb
   ```

2. Check if the MongoDB container is healthy:
   ```bash
   docker logs church-planner-mongodb
   ```

3. Verify the connection string in the server container:
   ```bash
   # For development
   MONGO_URI=mongodb://mongodb:27017/church-planner
   
   # For production with authentication
   MONGO_URI=mongodb://username:password@mongodb:27017/church-planner?authSource=admin
   ```

4. Ensure the containers are on the same network:
   ```bash
   docker network inspect church-planner-network
   ```

### Issue: Docker build fails

**Error message:**
```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /app/package.json
```

**Solution:**

1. Make sure the Dockerfile is in the correct directory
2. Check that the COPY commands are correct
3. Verify that the package.json file exists and is readable

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. Check the GitHub issues to see if others have encountered the same problem
2. Create a new issue with detailed information about your problem, including:
   - Error messages
   - Steps to reproduce
   - Your environment (OS, Node.js version, npm version)
   - Any relevant logs 