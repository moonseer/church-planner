#!/bin/bash

# Make this script executable with: chmod +x docker-commands.sh

# Function to display help
show_help() {
    echo "Church Planner Docker Commands"
    echo "------------------------------"
    echo "Usage: ./docker-commands.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev-up        Start development environment"
    echo "  dev-down      Stop development environment"
    echo "  dev-logs      Show logs from development environment"
    echo "  prod-up       Start production environment"
    echo "  prod-down     Stop production environment"
    echo "  prod-logs     Show logs from production environment"
    echo "  build         Rebuild all containers"
    echo "  clean         Remove all containers, volumes, and images"
    echo "  help          Show this help message"
}

# Check if command is provided
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

# Process commands
case "$1" in
    dev-up)
        echo "Starting development environment..."
        docker-compose up -d
        echo "Development environment started. Access the app at http://localhost:4000"
        ;;
    dev-down)
        echo "Stopping development environment..."
        docker-compose down
        echo "Development environment stopped."
        ;;
    dev-logs)
        echo "Showing logs from development environment..."
        docker-compose logs -f
        ;;
    prod-up)
        echo "Starting production environment..."
        docker-compose -f docker-compose.prod.yml up -d
        echo "Production environment started. Access the app at http://localhost"
        ;;
    prod-down)
        echo "Stopping production environment..."
        docker-compose -f docker-compose.prod.yml down
        echo "Production environment stopped."
        ;;
    prod-logs)
        echo "Showing logs from production environment..."
        docker-compose -f docker-compose.prod.yml logs -f
        ;;
    build)
        echo "Rebuilding all containers..."
        docker-compose build --no-cache
        echo "Development containers rebuilt."
        docker-compose -f docker-compose.prod.yml build --no-cache
        echo "Production containers rebuilt."
        ;;
    clean)
        echo "Removing all containers, volumes, and images..."
        docker-compose down -v
        docker-compose -f docker-compose.prod.yml down -v
        echo "Containers and volumes removed."
        ;;
    help)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac 