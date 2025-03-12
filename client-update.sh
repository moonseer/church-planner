#!/bin/bash

# Make this script executable
chmod +x client-update.sh

# Function to display usage information
show_usage() {
  echo "Usage: ./client-update.sh [OPTION]"
  echo "Update, rebuild, or view logs for the church-planner containers."
  echo ""
  echo "Options:"
  echo "  -h, --help       Display this help message"
  echo "  -c, --calendar   Update Calendar component (copies Dashboard.tsx and Calendar.tsx)"
  echo "  -d, --dashboard  Update Dashboard only (copies Dashboard.tsx)"
  echo "  -s, --server     Update server files (copies server files and restarts the server)"
  echo "  -r, --rebuild    Completely rebuild the containers"
  echo "  -a, --all        Update all components (copies all modified files)"
  echo "  -l, --logs       View the client container logs (use -l=100 to see last 100 lines)"
  echo "  -f, --follow     View and follow the client container logs in real-time"
  echo "  -sl, --server-logs View the server container logs"
  echo "  -sf, --server-follow Follow the server container logs in real-time"
  echo ""
  echo "If no option is provided, it will update the Dashboard by default."
}

# Default action
ACTION="dashboard"
LOG_LINES="50"  # Default number of log lines to show

# Parse command line arguments
if [ $# -gt 0 ]; then
  case "$1" in
    -h|--help)
      show_usage
      exit 0
      ;;
    -c|--calendar)
      ACTION="calendar"
      ;;
    -d|--dashboard)
      ACTION="dashboard"
      ;;
    -s|--server)
      ACTION="server"
      ;;
    -r|--rebuild)
      ACTION="rebuild"
      ;;
    -a|--all)
      ACTION="all"
      ;;
    -l=*|--logs=*)
      ACTION="logs"
      LOG_LINES="${1#*=}"  # Extract number after equals sign
      ;;
    -l|--logs)
      ACTION="logs"
      ;;
    -f|--follow)
      ACTION="follow_logs"
      ;;
    -sl|--server-logs)
      ACTION="server_logs"
      ;;
    -sf|--server-follow)
      ACTION="server_follow_logs"
      ;;
    *)
      echo "Unknown option: $1"
      show_usage
      exit 1
      ;;
  esac
fi

# Execute the selected action
case "$ACTION" in
  calendar)
    echo "Updating Calendar component..."
    docker cp client/src/pages/Dashboard.tsx church-planner-client:/app/src/pages/
    docker cp client/src/components/dashboard/Calendar.tsx church-planner-client:/app/src/components/dashboard/
    docker cp client/src/components/dashboard/SimpleCalendar.tsx church-planner-client:/app/src/components/dashboard/
    
    # Ensure the events directory exists
    docker exec church-planner-client mkdir -p /app/src/components/events
    
    # Copy the event components
    docker cp client/src/components/events/CreateEventButton.tsx church-planner-client:/app/src/components/events/
    docker cp client/src/components/events/EventForm.tsx church-planner-client:/app/src/components/events/
    docker cp client/src/components/events/EventFormModal.tsx church-planner-client:/app/src/components/events/
    
    # Ensure the types directory exists
    docker exec church-planner-client mkdir -p /app/src/types
    
    # Copy the types
    docker cp client/src/types/event.ts church-planner-client:/app/src/types/
    
    # Copy the services
    docker cp client/src/services/eventService.ts church-planner-client:/app/src/services/
    
    echo "Restarting the client container..."
    docker restart church-planner-client
    
    echo "Done! The client has been updated with the latest calendar changes."
    echo "To view logs, run: ./client-update.sh --logs"
    ;;
    
  dashboard)
    echo "Updating Dashboard component..."
    docker cp client/src/pages/Dashboard.tsx church-planner-client:/app/src/pages/
    
    # Ensure the events directory exists
    docker exec church-planner-client mkdir -p /app/src/components/events
    
    # Copy the event components
    docker cp client/src/components/events/CreateEventButton.tsx church-planner-client:/app/src/components/events/
    docker cp client/src/components/events/EventForm.tsx church-planner-client:/app/src/components/events/
    docker cp client/src/components/events/EventFormModal.tsx church-planner-client:/app/src/components/events/
    
    # Ensure the types directory exists
    docker exec church-planner-client mkdir -p /app/src/types
    
    # Copy the types
    docker cp client/src/types/event.ts church-planner-client:/app/src/types/
    
    # Copy the services
    docker cp client/src/services/eventService.ts church-planner-client:/app/src/services/
    
    echo "Restarting the client container..."
    docker restart church-planner-client
    
    echo "Done! The client has been updated with the latest dashboard changes."
    echo "To view logs, run: ./client-update.sh --logs"
    ;;
    
  server)
    echo "Updating server files..."
    docker cp server/src/models/Event.ts church-planner-server:/app/src/models/
    docker cp server/src/controllers/eventController.ts church-planner-server:/app/src/controllers/
    docker cp server/src/routes/eventRoutes.ts church-planner-server:/app/src/routes/
    docker cp server/src/server.ts church-planner-server:/app/src/
    
    echo "Restarting the server container..."
    docker restart church-planner-server
    
    echo "Done! The server has been updated with the latest changes."
    echo "To view server logs, run: ./client-update.sh --server-logs"
    ;;
    
  rebuild)
    echo "Stopping containers..."
    docker stop church-planner-client church-planner-server
    
    echo "Removing containers..."
    docker rm church-planner-client church-planner-server
    
    echo "Rebuilding containers..."
    docker-compose build client server
    
    echo "Starting containers..."
    docker-compose up -d client server
    
    echo "Done! The containers have been completely rebuilt with the latest changes."
    echo "To view logs, run: ./client-update.sh --logs"
    ;;
    
  all)
    echo "Updating all client components..."
    # Find all modified files in the client directory and copy them
    find client/src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.css" | while read file; do
      # Get the relative path inside the container
      container_path="/app/$(echo $file | sed 's|^client/||')"
      container_dir=$(dirname "$container_path")
      
      echo "Copying $file to $container_path"
      # Ensure the directory exists in the container
      docker exec church-planner-client mkdir -p "$container_dir"
      docker cp "$file" "church-planner-client:$container_path"
    done
    
    echo "Updating all server components..."
    # Find all modified files in the server directory and copy them
    find server/src -type f -name "*.ts" -o -name "*.js" | while read file; do
      # Get the relative path inside the container
      container_path="/app/$(echo $file | sed 's|^server/||')"
      container_dir=$(dirname "$container_path")
      
      echo "Copying $file to $container_path"
      # Ensure the directory exists in the container
      docker exec church-planner-server mkdir -p "$container_dir"
      docker cp "$file" "church-planner-server:$container_path"
    done
    
    echo "Restarting containers..."
    docker restart church-planner-client church-planner-server
    
    echo "Done! All components have been updated."
    echo "To view client logs, run: ./client-update.sh --logs"
    echo "To view server logs, run: ./client-update.sh --server-logs"
    ;;
    
  logs)
    echo "Showing the last $LOG_LINES lines of logs for the client container..."
    docker logs --tail "$LOG_LINES" church-planner-client
    
    echo ""
    echo "To follow logs in real-time, run: ./client-update.sh --follow"
    echo "To view browser console logs, open your browser's developer tools (F12)"
    ;;
    
  follow_logs)
    echo "Following logs for the client container in real-time (press Ctrl+C to exit)..."
    docker logs --follow church-planner-client
    ;;
    
  server_logs)
    echo "Showing the last $LOG_LINES lines of logs for the server container..."
    docker logs --tail "$LOG_LINES" church-planner-server
    
    echo ""
    echo "To follow server logs in real-time, run: ./client-update.sh --server-follow"
    ;;
    
  server_follow_logs)
    echo "Following logs for the server container in real-time (press Ctrl+C to exit)..."
    docker logs --follow church-planner-server
    ;;
esac 