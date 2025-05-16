# Backend Structure Document

## Overview

This document outlines the architecture, structure, and organization of the backend services for the Samudra Paket ERP system. The backend follows a microservice architecture with an API Gateway pattern to ensure scalability, maintainability, and separation of concerns.

## Architecture

### Microservice Architecture

The backend is structured as a collection of microservices, each responsible for a specific business domain. This approach allows for:

- Independent development and deployment
- Scalability of individual components
- Technology flexibility
- Fault isolation
- Team autonomy

### High-Level Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Web Frontend   │     │ Mobile Frontend │
│                 │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────┐
│                                         │
│              API Gateway                │
│                                         │
└───┬─────────┬─────────┬─────────┬───────┘
    │         │         │         │
    ▼         ▼         ▼         ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│         │ │         │ │         │ │         │
│  Auth   │ │  Core   │ │Operation│ │ Finance │
│ Service │ │ Service │ │ Service │ │ Service │
│         │ │         │ │         │ │         │
└────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
     │           │           │           │
     ▼           ▼           ▼           ▼
┌─────────────────────────────────────────┐
│                                         │
│              Event Bus                  │
│                                         │
└───┬─────────┬─────────┬─────────┬───────┘
    │         │         │         │
    ▼         ▼         ▼         ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│         │ │         │ │         │ │         │
│ MongoDB │ │  Redis  │ │  File   │ │ External│
│         │ │         │ │ Storage │ │  APIs   │
│         │ │         │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

## API Gateway

The API Gateway serves as the entry point for all client requests and provides the following functionalities:

- Request routing to appropriate microservices
- Authentication and authorization
- Rate limiting and throttling
- Request/response transformation
- API documentation
- Caching
- Circuit breaking
- Logging and monitoring

### Implementation

- **Framework**: Express.js
- **Authentication**: JWT-based with refresh token mechanism
- **Documentation**: Swagger/OpenAPI
- **Rate Limiting**: Express-rate-limit

## Microservices

### 1. Authentication Service

**Responsibilities**:
- User registration and authentication
- Role and permission management
- Session handling
- Password reset
- Multi-factor authentication

**Endpoints**:
- `/auth/register`
- `/auth/login`
- `/auth/refresh-token`
- `/auth/logout`
- `/auth/reset-password`
- `/auth/verify-email`

### 2. Core Service

**Responsibilities**:
- User profile management
- Branch and division management
- Employee management
- System configuration

**Endpoints**:
- `/users`
- `/branches`
- `/divisions`
- `/employees`
- `/configurations`

### 3. Operations Service

**Responsibilities**:
- Pickup management
- Shipment processing
- Delivery management
- Vehicle management
- Return processing

**Endpoints**:
- `/pickups`
- `/shipments`
- `/deliveries`
- `/vehicles`
- `/returns`

### 4. Finance Service

**Responsibilities**:
- Invoice generation
- Payment processing
- Accounting and journal entries
- Financial reporting
- Tax calculation

**Endpoints**:
- `/invoices`
- `/payments`
- `/journals`
- `/accounts`
- `/reports/financial`

### 5. Notification Service

**Responsibilities**:
- Email notifications
- SMS notifications
- Push notifications
- Notification templates

**Endpoints**:
- `/notifications`
- `/templates`
- `/notifications/settings`

### 6. Reporting Service

**Responsibilities**:
- Operational reports
- Performance metrics
- Analytics
- Dashboard data

**Endpoints**:
- `/reports/operational`
- `/reports/performance`
- `/analytics`
- `/dashboard`

## Service Structure

Each microservice follows a hexagonal architecture pattern with the following structure:

```
/service-name
  /src
    /api              # API Layer
      /controllers    # Request handlers
      /routes         # Route definitions
      /middlewares    # API middlewares
      /validators     # Request validation
      /docs           # API documentation
    
    /application      # Application Layer
      /services       # Business logic
      /use-cases      # Use case implementations
      /dtos           # Data Transfer Objects
    
    /domain           # Domain Layer
      /models         # Domain models
      /entities       # Business entities
      /value-objects  # Value objects
      /events         # Domain events
    
    /infrastructure   # Infrastructure Layer
      /repositories   # Data access
      /database       # Database connection
      /external       # External service clients
      /messaging      # Message queue clients
      /storage        # File storage
    
    /config           # Configuration
    /utils            # Utilities
    /types            # Type definitions
    server.js         # Entry point
```

## Data Access Layer

### MongoDB with Mongoose

The system uses MongoDB as the primary database with Mongoose ODM for data modeling and validation.

**Example Schema**:

```javascript
// User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (value) => /\S+@\S+\.\S+/.test(value),
      message: 'Email is invalid',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff', 'driver', 'courier'],
    default: 'staff',
  },
  permissions: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, { timestamps: true });
```

### Repository Pattern

The system implements the repository pattern to abstract data access:

```javascript
// User Repository
class UserRepository {
  async findById(id) {
    return User.findById(id);
  }
  
  async findByEmail(email) {
    return User.findOne({ email });
  }
  
  async create(userData) {
    const user = new User(userData);
    return user.save();
  }
  
  async update(id, userData) {
    return User.findByIdAndUpdate(id, userData, { new: true });
  }
  
  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}
```

## Error Handling

The backend implements a standardized error handling approach:

```javascript
// Error handling middleware
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const data = err.data || {};
  
  res.status(status).json({
    success: false,
    message,
    data,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
  
  // Log error for monitoring
  logger.error(`${status} - ${message} - ${req.originalUrl} - ${req.method}`);
};
```

## Authentication and Authorization

### JWT-based Authentication

```javascript
// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
```

### Role-Based Access Control

```javascript
// Authorization middleware
const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }
    
    const hasPermission = requiredPermissions.every(permission => 
      req.user.permissions.includes(permission)
    );
    
    if (!hasPermission) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    
    next();
  };
};
```

## API Documentation

All APIs are documented using Swagger/OpenAPI:

```javascript
// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Samudra Paket ERP API',
      version: '1.0.0',
      description: 'API documentation for Samudra Paket ERP system',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/api/routes/*.js', './src/api/docs/*.yaml'],
};
```

## Event-Driven Communication

The system uses an event-driven architecture for asynchronous communication between services:

```javascript
// Event publisher
class EventPublisher {
  constructor(channel) {
    this.channel = channel;
  }
  
  async publish(exchange, routingKey, message) {
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    
    return this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }
}

// Event subscriber
class EventSubscriber {
  constructor(channel) {
    this.channel = channel;
  }
  
  async subscribe(exchange, routingKey, handler) {
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    
    const { queue } = await this.channel.assertQueue('', { exclusive: true });
    
    await this.channel.bindQueue(queue, exchange, routingKey);
    
    return this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await handler(content);
          this.channel.ack(msg);
        } catch (error) {
          // Handle error and potentially requeue
          this.channel.nack(msg);
        }
      }
    });
  }
}
```

## Deployment

The backend services are containerized using Docker and deployed on Railway.com:

```dockerfile
# Dockerfile example
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

## Conclusion

This backend structure document provides a comprehensive overview of the architecture, organization, and implementation details of the Samudra Paket ERP system's backend services. By following this structure, developers can ensure consistency, maintainability, and scalability across all backend components.