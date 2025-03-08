# Church Planner - Project Structure

This document outlines the technical architecture and folder structure for the Church Planner application.

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Component Library**: Headless UI with custom styling
- **Form Handling**: React Hook Form with Zod validation
- **API Client**: Axios with React Query
- **Testing**: Jest and React Testing Library
- **Build Tool**: Vite

### Backend
- **Framework**: Node.js with Express
- **API Style**: RESTful with some GraphQL endpoints for complex data requirements
- **Authentication**: JWT with refresh tokens
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis for performance optimization
- **File Storage**: AWS S3 or similar cloud storage
- **Email Service**: SendGrid or similar
- **Testing**: Jest with Supertest

### DevOps
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (frontend), AWS/Heroku (backend)
- **Monitoring**: Sentry for error tracking
- **Analytics**: Mixpanel or similar

## Project Structure

```
church-planner/
├── client/                      # Frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images, fonts, etc.
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Generic components (Button, Card, etc.)
│   │   │   ├── layout/          # Layout components (Sidebar, Header, etc.)
│   │   │   ├── services/        # Service planning components
│   │   │   ├── volunteers/      # Volunteer management components
│   │   │   ├── songs/           # Song library components
│   │   │   └── ...
│   │   ├── features/            # Feature-specific modules
│   │   │   ├── auth/            # Authentication logic
│   │   │   ├── services/        # Service planning feature
│   │   │   ├── volunteers/      # Volunteer management feature
│   │   │   ├── songs/           # Song library feature
│   │   │   └── ...
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── store/               # Redux store setup
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Utility functions
│   │   ├── App.tsx              # Main App component
│   │   └── main.tsx             # Entry point
│   ├── .eslintrc.js             # ESLint configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── vite.config.ts           # Vite configuration
│   └── package.json             # Frontend dependencies
│
├── server/                      # Backend application
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Utility functions
│   │   └── app.js               # Express app setup
│   ├── .eslintrc.js             # ESLint configuration
│   ├── tsconfig.json            # TypeScript configuration
│   └── package.json             # Backend dependencies
│
├── .github/                     # GitHub configuration
│   └── workflows/               # GitHub Actions workflows
│
├── docs/                        # Documentation
│   ├── API.md                   # API documentation
│   ├── CONTRIBUTING.md          # Contribution guidelines
│   └── ...
│
├── .gitignore                   # Git ignore file
├── README.md                    # Project overview
├── PROGRESS.md                  # Development progress tracking
├── UI_DESIGN.md                 # UI design documentation
└── package.json                 # Root package.json for scripts
```

## Data Models

### User
```typescript
interface User {
  _id: string;
  email: string;
  password: string; // Hashed
  firstName: string;
  lastName: string;
  role: 'admin' | 'leader' | 'volunteer';
  teams: Team[];
  church: Church;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}
```

### Church
```typescript
interface Church {
  _id: string;
  name: string;
  address: Address;
  timezone: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  subscription: Subscription;
  createdAt: Date;
  updatedAt: Date;
}
```

### Team
```typescript
interface Team {
  _id: string;
  name: string;
  description: string;
  church: Church;
  leader: User;
  members: User[];
  positions: Position[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Service
```typescript
interface Service {
  _id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  church: Church;
  status: 'draft' | 'published' | 'completed';
  items: ServiceItem[];
  teams: TeamAssignment[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
}
```

### ServiceItem
```typescript
interface ServiceItem {
  _id: string;
  title: string;
  type: 'song' | 'reading' | 'prayer' | 'announcement' | 'custom' | 'media';
  duration: number; // in minutes
  position: number;
  content: any; // Varies based on type
  notes: string;
  assignedTo: User[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Song
```typescript
interface Song {
  _id: string;
  title: string;
  artist: string;
  author: string;
  copyright: string;
  ccliNumber: string;
  key: string;
  tempo: number;
  timeSignature: string;
  tags: string[];
  lyrics: Lyric[];
  arrangements: Arrangement[];
  attachments: Attachment[];
  church: Church;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Churches
- `GET /api/churches` - Get all churches (admin only)
- `GET /api/churches/:id` - Get church by ID
- `POST /api/churches` - Create church
- `PUT /api/churches/:id` - Update church
- `DELETE /api/churches/:id` - Delete church

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add member to team
- `DELETE /api/teams/:id/members/:userId` - Remove member from team

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `POST /api/services/:id/items` - Add item to service
- `PUT /api/services/:id/items/:itemId` - Update service item
- `DELETE /api/services/:id/items/:itemId` - Remove item from service
- `PUT /api/services/:id/publish` - Publish service
- `POST /api/services/:id/duplicate` - Duplicate service

### Songs
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get song by ID
- `POST /api/songs` - Create song
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song
- `GET /api/songs/search` - Search songs

## Authentication Flow

1. User registers or logs in
2. Server validates credentials and returns JWT access token and refresh token
3. Client stores tokens (access token in memory, refresh token in HTTP-only cookie)
4. Client includes access token in Authorization header for API requests
5. When access token expires, client uses refresh token to get a new access token
6. On logout, both tokens are invalidated

## Deployment Strategy

### Development
- Local development with hot reloading
- Development database instance
- Feature branch deployments for testing

### Staging
- Automated deployments from main branch
- Staging database with anonymized production data
- Full integration testing

### Production
- Manual promotion from staging
- Database backups and monitoring
- Performance optimization
- Analytics and error tracking

## Security Considerations

- HTTPS for all communications
- JWT with short expiration for access tokens
- CSRF protection
- Input validation and sanitization
- Rate limiting for authentication endpoints
- Regular security audits
- Data encryption at rest and in transit 