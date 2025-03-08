# Church Planner - Architecture Documentation

This document provides a detailed overview of the Church Planner application architecture, explaining the various components and how they interact with each other.

## System Overview

Church Planner follows a modern client-server architecture with a clear separation between the frontend and backend components. This separation allows for independent development, testing, and deployment of each component.

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

## Frontend Architecture

The frontend is built using React with TypeScript, providing a type-safe and component-based user interface. The application follows a modular architecture with clear separation of concerns.

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

### Key Frontend Components

1. **Redux Store**: Manages global application state using Redux Toolkit for efficient state management.
   - Slices for different domains (auth, churches, services, etc.)
   - Thunks for asynchronous operations

2. **React Query**: Handles data fetching, caching, and synchronization with the server.
   - Optimistic updates for better user experience
   - Automatic refetching and background updates

3. **React Router**: Manages navigation and routing within the application.
   - Protected routes for authenticated users
   - Role-based access control

4. **UI Components**: Reusable UI building blocks organized into:
   - Common components (buttons, inputs, cards, etc.)
   - Layout components (navigation, sidebar, etc.)
   - Feature-specific components (service planner, volunteer scheduler, etc.)

5. **Services/Hooks**: Encapsulate business logic and API interactions.
   - API services for communication with the backend
   - Custom hooks for reusable logic

6. **Tailwind CSS**: Provides utility-first styling with a consistent design system.
   - Custom theme configuration
   - Responsive design utilities

## Backend Architecture

The backend is built using Node.js with Express, providing a RESTful API for the frontend to consume. It follows a layered architecture with clear separation of concerns.

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

### Key Backend Components

1. **Middleware**: Handles cross-cutting concerns.
   - Authentication and authorization
   - Request validation
   - Error handling
   - Logging
   - CORS

2. **Routes**: Define API endpoints and map them to controllers.
   - Organized by domain (auth, churches, services, etc.)
   - Input validation using express-validator

3. **Controllers**: Handle HTTP requests and responses.
   - Business logic orchestration
   - Response formatting
   - Error handling

4. **Models**: Define data structures and database schemas.
   - Mongoose schemas for MongoDB
   - Data validation
   - Relationships between entities

5. **Services**: Encapsulate business logic and external integrations.
   - Reusable business logic
   - Integration with external services

6. **Database Access**: Manages interactions with the database.
   - MongoDB with Mongoose ODM
   - Query optimization
   - Data integrity

## Data Flow

The application follows a unidirectional data flow pattern, which makes the application behavior more predictable and easier to debug.

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

1. **User Interaction**: User interacts with the view (UI components).
2. **Action Dispatch**: An action is dispatched to the Redux store.
3. **State Update**: Reducers process the action and update the state.
4. **View Update**: The view re-renders based on the new state.
5. **API Call**: If needed, an API call is made to the server.
6. **Database Operation**: The server performs database operations.
7. **Response**: The server sends a response back to the client.
8. **State Update**: The client updates the state based on the response.

## Authentication Flow

The application uses JWT (JSON Web Tokens) for authentication, with a secure token-based approach.

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Login   │────►│  Server  │────►│  JWT     │────►│  Client  │
│  Request │     │  Validate│     │  Created │     │  Stores  │
│          │     │          │     │          │     │  Token   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                        │
                                                        │
                                                        ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Server  │◄────┤  API     │◄────┤  Token   │◄────┤  Request │
│  Validate│     │  Request │     │  Attached│     │  Resource│
│  Token   │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

1. **Login Request**: User submits login credentials.
2. **Server Validation**: Server validates credentials against the database.
3. **JWT Creation**: Server creates a JWT token with user information and expiration.
4. **Client Storage**: Client stores the token (memory for access token, HTTP-only cookie for refresh token).
5. **Request Resource**: Client makes API requests with the token in the Authorization header.
6. **Token Validation**: Server validates the token for each request.
7. **Token Refresh**: When the access token expires, the client uses the refresh token to get a new access token.

## Database Schema

The application uses MongoDB with Mongoose ODM for data storage. The main entities and their relationships are:

```
┌───────────┐       ┌───────────┐       ┌───────────┐
│           │       │           │       │           │
│   User    │───────┤   Church  │───────┤   Team    │
│           │       │           │       │           │
└───────────┘       └───────────┘       └───────────┘
      │                   │                   │
      │                   │                   │
      ▼                   ▼                   ▼
┌───────────┐       ┌───────────┐       ┌───────────┐
│           │       │           │       │           │
│  Profile  │       │  Service  │       │   Song    │
│           │       │           │       │           │
└───────────┘       └───────────┘       └───────────┘
```

### Key Entities

1. **User**: Represents a user of the system.
   - Authentication information
   - Personal details
   - Role and permissions
   - Privacy settings

2. **Church**: Represents a church organization.
   - Church details
   - Service schedule
   - Ministries
   - Settings

3. **Team**: Represents a ministry team within a church.
   - Team details
   - Members
   - Positions
   - Schedules

4. **Service**: Represents a church service.
   - Service details
   - Service items
   - Team assignments
   - Notes

5. **Song**: Represents a worship song.
   - Song details
   - Lyrics
   - Arrangements
   - Usage history

## Deployment Architecture

The application is designed for cloud deployment with separate environments for development, staging, and production.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Production                               │
├─────────────────┬─────────────────┬─────────────────────────────┤
│                 │                 │                             │
│  Frontend       │  Backend        │     Database                │
│  (Vercel)       │  (AWS/Heroku)   │     (MongoDB Atlas)         │
│                 │                 │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         Staging                                  │
├─────────────────┬─────────────────┬─────────────────────────────┤
│                 │                 │                             │
│  Frontend       │  Backend        │     Database                │
│  (Vercel)       │  (AWS/Heroku)   │     (MongoDB Atlas)         │
│                 │                 │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         Development                              │
├─────────────────┬─────────────────┬─────────────────────────────┤
│                 │                 │                             │
│  Frontend       │  Backend        │     Database                │
│  (Local)        │  (Local)        │     (Local/Atlas)           │
│                 │                 │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### CI/CD Pipeline

The application uses GitHub Actions for continuous integration and deployment.

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Code    │────►│  Build   │────►│  Test    │────►│  Deploy  │
│  Commit  │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

1. **Code Commit**: Developer commits code to the repository.
2. **Build**: GitHub Actions builds the application.
3. **Test**: Automated tests are run to ensure quality.
4. **Deploy**: If tests pass, the application is deployed to the appropriate environment.

## Security Architecture

The application implements multiple layers of security to protect user data and prevent unauthorized access.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Security Layers                          │
├─────────────────┬─────────────────┬─────────────────────────────┤
│                 │                 │                             │
│  Network        │  Application    │     Data                    │
│  Security       │  Security       │     Security                │
│                 │                 │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### Security Measures

1. **Network Security**:
   - HTTPS for all communications
   - Firewall rules
   - DDoS protection

2. **Application Security**:
   - JWT authentication
   - Role-based access control
   - Input validation
   - CSRF protection
   - Rate limiting

3. **Data Security**:
   - Password hashing
   - Data encryption
   - Privacy controls
   - GDPR compliance

## Performance Optimization

The application implements various performance optimizations to ensure a fast and responsive user experience.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Performance Optimizations                    │
├─────────────────┬─────────────────┬─────────────────────────────┤
│                 │                 │                             │
│  Frontend       │  Backend        │     Database                │
│  Optimizations  │  Optimizations  │     Optimizations           │
│                 │                 │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### Optimization Techniques

1. **Frontend Optimizations**:
   - Code splitting
   - Lazy loading
   - Memoization
   - Virtual scrolling
   - Image optimization

2. **Backend Optimizations**:
   - Caching with Redis
   - Response compression
   - Efficient API design
   - Asynchronous processing

3. **Database Optimizations**:
   - Indexing
   - Query optimization
   - Connection pooling
   - Data denormalization where appropriate

## Scalability Considerations

The application is designed to scale horizontally to handle increased load.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Scalability Architecture                     │
├─────────────────┬─────────────────┬─────────────────────────────┤
│                 │                 │                             │
│  Load           │  Multiple       │     Database                │
│  Balancer       │  Instances      │     Scaling                 │
│                 │                 │                             │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### Scaling Strategies

1. **Frontend Scaling**:
   - CDN for static assets
   - Multiple instances behind a load balancer

2. **Backend Scaling**:
   - Stateless design for horizontal scaling
   - Containerization for easy deployment
   - Auto-scaling based on load

3. **Database Scaling**:
   - Sharding for horizontal scaling
   - Replication for read scaling
   - Caching to reduce database load

## Future Architecture Considerations

As the application evolves, we plan to consider the following architectural enhancements:

1. **Microservices**: Breaking down the monolithic backend into smaller, focused services.
2. **Event-Driven Architecture**: Implementing event-driven communication between services.
3. **GraphQL**: Adding GraphQL support for more efficient data fetching.
4. **Serverless Functions**: Using serverless functions for specific features.
5. **Progressive Web App**: Enhancing offline capabilities and mobile experience.
6. **Real-time Updates**: Implementing WebSockets for real-time collaboration.

## Conclusion

The Church Planner architecture is designed to be modular, scalable, and maintainable. By following modern best practices and a clear separation of concerns, the application can evolve and grow while maintaining code quality and performance. 