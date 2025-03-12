# Logging Guide for Church Planner

This guide explains the different ways to view logs in your Church Planner application to help with debugging and monitoring.

## Container Logs

### Using the client-update.sh Script

The `client-update.sh` script now includes options for viewing logs:

```bash
# View the last 50 lines of logs (default)
./client-update.sh --logs

# View a specific number of log lines (e.g., 100)
./client-update.sh --logs=100

# Follow logs in real-time (press Ctrl+C to exit)
./client-update.sh --follow
```

### Using Docker Commands Directly

You can also use Docker commands directly to view logs:

```bash
# View logs for the client container
docker logs church-planner-client

# View the last N lines of logs
docker logs --tail 100 church-planner-client

# Follow logs in real-time
docker logs --follow church-planner-client

# View logs with timestamps
docker logs --timestamps church-planner-client
```

If you have other containers in your application:

```bash
# List all running containers
docker ps

# View logs for a specific container
docker logs [container_name_or_id]
```

## Browser Console Logs

For client-side debugging, the browser's developer tools are essential:

1. Open your application in a web browser
2. Open Developer Tools:
   - Chrome/Edge: Press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
   - Firefox: Press F12 or Ctrl+Shift+I
   - Safari: Enable Developer Tools in Preferences > Advanced, then press Cmd+Option+I

3. Navigate to the "Console" tab to view:
   - JavaScript errors and warnings
   - `console.log()` output from your application
   - Network request issues

The debug output we've added to the Calendar component will appear in the browser console.

## React Developer Tools

For React-specific debugging:

1. Install the React Developer Tools extension for your browser
2. Open Developer Tools and navigate to the "Components" or "React" tab
3. Inspect component props, state, and the component tree

## Viewing Server Logs

If you have a backend server:

```bash
# View logs for the server container
docker logs church-planner-server

# Follow server logs
docker logs --follow church-planner-server
```

## Viewing All Container Logs

To view logs from all containers in your docker-compose setup:

```bash
# View logs from all services
docker-compose logs

# Follow logs from all services
docker-compose logs --follow

# View logs for specific services
docker-compose logs client server
```

## Debugging Tips

1. **Add Temporary Debug Output**: Add `console.log()` statements in your React components to track state changes and component lifecycle events.

2. **Check Network Requests**: Use the Network tab in browser developer tools to ensure API requests are working correctly.

3. **Inspect React Component State**: Use React Developer Tools to inspect component props and state.

4. **Check for Console Errors**: Red error messages in the browser console often point directly to issues.

5. **Use Breakpoints**: Set breakpoints in your code using the Sources tab in browser developer tools to step through code execution.

Remember to remove or disable excessive logging in production environments to maintain performance. 