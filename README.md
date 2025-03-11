# Church Planner

A modern, intuitive church planning application that helps organize Sunday church services and enables ministries to collaborate efficiently. Our goal is to create a more user-friendly alternative to Planning Center Services with an improved UI/UX experience.

## Features

- **Intuitive Service Planning**: Create and manage service plans with a drag-and-drop interface that's easy to use for staff and volunteers.
- **Volunteer Management**: Schedule, notify, and track volunteer participation across different ministry teams.
- **Song Library**: Maintain a comprehensive database of worship songs with lyrics, chord charts, and arrangements.
- **Multi-Service Support**: Easily manage multiple services with different schedules, teams, and content.
- **Team Communication**: Built-in messaging and notification system to keep everyone informed.
- **Rehearsal Tools**: Schedule and manage rehearsals, including attendance tracking and resource sharing.
- **Mobile-Friendly Design**: Access your plans from any device with a responsive, mobile-first interface.
- **Custom Reporting**: Generate reports on service elements, volunteer participation, and song usage.

## UI/UX Philosophy

Our application prioritizes:

1. **Simplicity**: Clean, uncluttered interfaces that focus on the task at hand.
2. **Efficiency**: Minimize clicks and streamline workflows for common tasks.
3. **Accessibility**: Ensure the application is usable by everyone, regardless of technical ability.
4. **Consistency**: Maintain a cohesive design language throughout the application.
5. **Feedback**: Provide clear feedback for user actions and system status.

## Architecture

### System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Client (React) │◄────►│  Server (Node)  │◄────►│  Database (DB)  │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  External APIs  │      │  File Storage   │      │  Cache (Redis)  │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

For a detailed explanation of the architecture, see [Architecture Documentation](docs/ARCHITECTURE.md).

### Client Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Application                        │
├─────────────────┬─────────────────┬─────────────────────────────┤
│                 │                 │                             │
│     Redux       │    React        │     React Router            │
│     Store       │    Query        │                             │
│                 │                 │                             │
├─────────────────┴─────────────────┴─────────────────────────────┤
│                                                                 │
│                       UI Components                             │
│                                                                 │
├─────────────────┬─────────────────┬─────────────────────────────┤
│                 │                 │                             │
│    Common       │    Layout       │     Feature-specific        │
│    Components   │    Components   │     Components              │
│                 │                 │                             │
├─────────────────┴─────────────────┴─────────────────────────────┤
│                                                                 │
│                       Services / Hooks                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                       Tailwind CSS                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Server Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Express Server                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                         Middleware                              │
│                                                                 │
├─────────────────┬─────────────────┬─────────────────────────────┤
│                 │                 │                             │
│    Routes       │    Controllers  │     Models                  │
│                 │                 │                             │
├─────────────────┴─────────────────┴─────────────────────────────┤
│                                                                 │
│                       Services                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                       Database Access                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Action  │────►│ Reducer  │────►│  State   │────►│   View   │
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                        │
                                                        │
                                                        ▼
                                                   ┌──────────┐
                                                   │          │
                                                   │   API    │
                                                   │          │
                                                   └──────────┘
                                                        │
                                                        │
                                                        ▼
                                                   ┌──────────┐
                                                   │          │
                                                   │ Database │
                                                   │          │
                                                   └──────────┘
```

## Technical Stack

### Frontend
- **Framework**: React with TypeScript
- **State Management**: Redux Toolkit
- **API Client**: Axios with React Query
- **Styling**: Tailwind CSS
- **Component Library**: Headless UI with custom styling
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Jest and React Testing Library
- **Build Tool**: Vite

### Backend
- **Framework**: Node.js with Express
- **API Style**: RESTful with JWT authentication
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis (planned)
- **File Storage**: AWS S3 (planned)
- **Email Service**: SendGrid (planned)
- **Testing**: Jest with Supertest

### DevOps
- **CI/CD**: GitHub Actions (planned)
- **Hosting**: Vercel (frontend), AWS/Heroku (backend)
- **Monitoring**: Sentry for error tracking (planned)
- **Analytics**: Mixpanel or similar (planned)

## Project Structure

The project follows a client-server architecture with separate directories for frontend and backend code:

```
church-planner/
├── client/                      # Frontend application
│   ├── public/                  # Static assets
│   └── src/                     # Source code
│       ├── assets/              # Images, fonts, etc.
│       ├── components/          # Reusable UI components
│       ├── features/            # Feature-specific modules
│       ├── hooks/               # Custom React hooks
│       ├── pages/               # Page components
│       ├── services/            # API services
│       ├── store/               # Redux store
│       ├── types/               # TypeScript types
│       └── utils/               # Utility functions
│
├── server/                      # Backend application
│   └── src/                     # Source code
│       ├── config/              # Configuration files
│       ├── controllers/         # Request handlers
│       ├── middleware/          # Express middleware
│       ├── models/              # Database models
│       ├── routes/              # API routes
│       ├── services/            # Business logic
│       └── utils/               # Utility functions
│
├── docs/                        # Documentation
└── README.md                    # Project overview
```

## Current Status

We have completed the following major components:

- **Project Setup**: Basic structure, configuration, and documentation
- **Design System**: Color scheme, typography, and component library
- **Authentication System**: User login, password reset, and JWT authentication
- **User Management**: Basic user model with roles
- **Church Management**: Initial church profiles and service schedules
- **Core UI**: Navigation, layout, and dashboard components

Recent improvements:
- Fixed server connection issues by changing the default port from 5000 to 8080
- Implemented proper User schema definition in the server
- Enhanced error handling in client-side components
- Improved user data handling in the authentication flow
- Set up Jest testing framework for server components

## Documentation

- [Progress](PROGRESS.md) - Current development status and backlog of items
- [UI Design](UI_DESIGN.md) - Detailed UI/UX design documentation
- [Project Structure](PROJECT_STRUCTURE.md) - Technical architecture and project structure
- [Improvements](IMPROVEMENTS.md) - Key improvements over Planning Center Services
- [Architecture](docs/ARCHITECTURE.md) - Detailed architecture documentation

## Getting Started

### Prerequisites

- Node.js (v14 or higher) - *for local development without Docker*
- npm or yarn - *for local development without Docker*
- MongoDB (local or Atlas) - *for local development without Docker*
- Docker and Docker Compose - *for containerized development and deployment*

### Installation

#### Option 1: Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/church-planner.git
   cd church-planner
   ```

2. Start the development environment:
   ```bash
   # Make the helper script executable
   chmod +x docker-commands.sh
   
   # Start the development environment
   ./docker-commands.sh dev-up
   ```

3. Access the application:
   - Client: http://localhost:4000
   - Server API: http://localhost:5000

4. To stop the development environment:
   ```bash
   ./docker-commands.sh dev-down
   ```

#### Option 2: Manual Setup (Without Docker)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/church-planner.git
   cd church-planner
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up MongoDB:
   
   **Option 1: Local MongoDB (Recommended for development)**
   
   - **Mac:**
     ```bash
     # Install MongoDB using Homebrew
     brew tap mongodb/brew
     brew install mongodb-community
     
     # Start MongoDB service
     brew services start mongodb/brew/mongodb-community
     
     # Verify MongoDB is running
     mongosh
     ```
   
   - **Windows:**
     - Download and install MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
     - Follow the installation instructions
     - Start MongoDB service from Windows Services
   
   - **Linux (Ubuntu):**
     ```bash
     # Import MongoDB public GPG key
     wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
     
     # Create a list file for MongoDB
     echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
     
     # Reload local package database
     sudo apt-get update
     
     # Install MongoDB packages
     sudo apt-get install -y mongodb-org
     
     # Start MongoDB service
     sudo systemctl start mongod
     
     # Verify MongoDB is running
     mongosh
     ```
   
   **Option 2: MongoDB Atlas (Cloud-based)**
   
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Set up database access (create a user with password)
   - Set up network access (allow access from your IP address)
   - Get your connection string and update the `.env` file

4. Set up environment variables:
   
   - Create a `.env` file in the server directory based on `.env.example`:
     ```bash
     cd server
     cp .env.example .env
     ```
   
   - Update the `.env` file with your MongoDB connection string and other settings:
     ```
     # Server Configuration
     PORT=5000
     NODE_ENV=development
     
     # JWT Authentication
     JWT_SECRET=your_secret_key_for_testing
     JWT_EXPIRE=1d
     JWT_REFRESH_EXPIRES_IN=7d
     
     # Database
     # For local MongoDB
     MONGO_URI=mongodb://localhost:27017/church-planner
     
     # CORS
     CORS_ORIGIN=http://localhost:4000
     ```

5. Start the development servers:
   
   **Option 1: Start client and server separately (recommended for debugging)**
   
   ```bash
   # Terminal 1: Start the server
   cd server
   npm run dev
   
   # Terminal 2: Start the client
   cd client
   npm run dev -- --port 4000
   ```
   
   **Option 2: Start both client and server concurrently**
   
   ```bash
   # From the root directory
   npm run dev
   ```

6. Access the application:
   - Client: http://localhost:4000
   - Server API: http://localhost:5000

### Docker Development

The Church Planner application is containerized using Docker, which provides several benefits:

1. **Consistent Environment**: Everyone works with the same environment, eliminating "it works on my machine" issues.
2. **Isolated Services**: Each component (client, server, database) runs in its own container.
3. **Easy Setup**: No need to install MongoDB or other dependencies locally.
4. **Volume Sharing**: Code changes are reflected immediately without rebuilding containers.

#### Docker Commands

We've provided a helper script to simplify Docker operations:

```bash
# Start development environment
./docker-commands.sh dev-up

# View logs from all containers
./docker-commands.sh dev-logs

# Stop development environment
./docker-commands.sh dev-down

# Start production environment
./docker-commands.sh prod-up

# Stop production environment
./docker-commands.sh prod-down

# Rebuild all containers
./docker-commands.sh build

# Clean up all containers, volumes, and images
./docker-commands.sh clean
```

#### Container Structure

The application is divided into the following containers:

1. **Client Container**: React frontend application
   - Development: Hot-reloading enabled
   - Production: Nginx serving static files

2. **Server Container**: Node.js/Express backend API
   - Development: Nodemon for auto-restart
   - Production: Optimized Node.js runtime

3. **MongoDB Container**: Database for the application
   - Development: Exposed port for direct access
   - Production: Secured with authentication

4. **Redis Container**: For caching (optional)
   - Used for performance optimization

#### Volume Sharing

In development mode, the following volumes are shared:

- `./client:/app`: Client source code is mounted into the container
- `./server:/app`: Server source code is mounted into the container

This allows you to make changes to the code and see them reflected immediately without rebuilding the containers.

### Production Deployment

For production deployment, use the production Docker Compose file:

1. Create a `.env` file based on `.env.prod.example`:
   ```bash
   cp .env.prod.example .env
   ```

2. Update the environment variables with your production values.

3. Start the production environment:
   ```bash
   ./docker-commands.sh prod-up
   ```

The production setup includes:

- Optimized builds for both client and server
- Nginx serving static files for the client
- Secure MongoDB with authentication
- Redis with password protection
- Environment variables for sensitive information

### Troubleshooting

For detailed troubleshooting steps, please see the [Troubleshooting Guide](docs/TROUBLESHOOTING.md).

Common issues:

1. **Port conflicts:**
   
   If you see an error like `Error: listen EADDRINUSE: address already in use :::5000`, it means the port is already in use. You can either:
   
   - Kill the process using the port:
     ```bash
     # Find the process ID (PID)
     lsof -i :5000
     
     # Kill the process
     kill -9 <PID>
     ```
   
   - Or change the port in the `.env` file and `docker-compose.yml`:
     ```
     PORT=8080
     ```
   
   **Note for macOS users**: Port 5000 is often used by the AirPlay service on macOS. We recommend using port 8080 instead to avoid conflicts. This has been set as the default in recent versions.

2. **MongoDB connection issues:**
   
   If you see errors connecting to MongoDB, check that:
   
   - MongoDB service is running
   - The connection string in `.env` is correct
   - Network access is properly configured (if using Atlas)

3. **Missing dependencies:**
   
   If you see errors about missing modules, make sure you've installed all dependencies:
   
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

4. **Authentication errors:**

   If you encounter issues with authentication:
   
   - Check that the User model is properly defined in the server
   - Verify that JWT tokens are being correctly generated and validated
   - Ensure the client is correctly handling user data
   - Check browser console for detailed error messages

5. **Running tests:**

   To run the server tests:
   ```bash
   cd server
   npm test
   ```

   If you encounter issues with TypeScript types in tests:
   ```bash
   npm install --save-dev @types/jest
   ```

## Contributing

We welcome contributions to the Church Planner project! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get involved.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.