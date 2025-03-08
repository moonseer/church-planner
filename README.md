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
- **Authentication System**: User registration, login/logout, password reset
- **User Management**: Profile management, privacy controls, GDPR compliance
- **Church Management**: Church profiles, service schedules, ministry management
- **Core UI**: Navigation, layout, and dashboard components

## Documentation

- [Progress](PROGRESS.md) - Current development status and backlog of items
- [UI Design](UI_DESIGN.md) - Detailed UI/UX design documentation
- [Project Structure](PROJECT_STRUCTURE.md) - Technical architecture and project structure
- [Improvements](IMPROVEMENTS.md) - Key improvements over Planning Center Services
- [Architecture](docs/ARCHITECTURE.md) - Detailed architecture documentation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

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
   
   - Or change the port in the `.env` file:
     ```
     PORT=5001
     ```

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

## Contributing

We welcome contributions to the Church Planner project! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get involved.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.