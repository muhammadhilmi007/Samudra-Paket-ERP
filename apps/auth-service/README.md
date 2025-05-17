# Authentication Service

## Overview

The Authentication Service is a microservice responsible for user authentication, authorization, and user management in the Samudra Paket ERP system. It follows hexagonal architecture principles with clear separation between API, application, domain, and infrastructure layers.

## Features

- User registration with email verification
- JWT-based authentication with refresh token mechanism
- Password management (reset, change, history)
- Session management
- Role-based access control (RBAC)
- Security logging and audit trails
- Account locking for brute force prevention
- Rate limiting for security

## Architecture

The service follows hexagonal architecture with the following layers:

- **API Layer**: Controllers, routes, validators, and middlewares
- **Application Layer**: Services and use cases
- **Domain Layer**: Models and entities
- **Infrastructure Layer**: Repositories, database connections, and external services

## Directory Structure

```
/auth-service
  /src
    /api              # API Layer
      /controllers    # Request handlers
      /routes         # Route definitions
      /middlewares    # API middlewares
      /validators     # Request validation
    /application      # Application Layer
      /services       # Service implementations
      /dtos           # Data transfer objects
    /domain           # Domain Layer
      /models         # Domain models/entities
    /infrastructure   # Infrastructure Layer
      /repositories   # Data access implementations
      /database       # Database connection
      /external       # External service clients
    /config           # Configuration
    /utils            # Utilities and helpers
    server.js         # Entry point
  package.json        # Dependencies
  .env.example        # Example environment variables
  README.md           # Documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v22 LTS)
- MongoDB
- Redis

### Installation

1. Clone the repository
2. Navigate to the auth-service directory
3. Install dependencies:
   ```
   npm install
   ```
4. Copy `.env.example` to `.env` and update the values:
   ```
   cp .env.example .env
   ```
5. Start the service:
   ```
   npm run dev
   ```

### Environment Variables

See `.env.example` for a list of required environment variables.

## API Documentation

API documentation is available at `/api-docs` when the service is running.

## Development

### Running in Development Mode

```
npm run dev
```

### Running Tests

```
npm test
```

### Database Seeding

```
npm run seed
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `GET /api/auth/verify-email/:token` - Verify user email
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user

### User Management

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/role/:role` - Get users by role
- `POST /api/users/:id/lock` - Lock user account
- `POST /api/users/:id/unlock` - Unlock user account

### Session Management

- `GET /api/sessions` - Get all active sessions (admin only)
- `GET /api/sessions/me` - Get all active sessions for current user
- `DELETE /api/sessions/:sessionId` - Revoke a specific session
- `DELETE /api/sessions/me/all` - Revoke all sessions for current user except current

### Security Logs

- `GET /api/security-logs` - Get all security logs
- `GET /api/security-logs/user/:userId` - Get logs by user ID
- `GET /api/security-logs/event/:eventType` - Get logs by event type
- `GET /api/security-logs/date-range` - Get logs by date range
- `GET /api/security-logs/status/:status` - Get logs by status
