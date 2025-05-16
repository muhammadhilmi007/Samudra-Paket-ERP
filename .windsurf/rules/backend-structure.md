---
trigger: always_on
---

# Backend Structure Rules

## Architecture Rules

1. All backend services must follow the microservice architecture with API Gateway pattern
2. Each microservice must be responsible for a specific business domain only
3. Services must communicate through well-defined APIs and event-driven messaging
4. Implement circuit breaker patterns for fault tolerance between services
5. Each microservice must be independently deployable and scalable
6. API Gateway must handle authentication, rate limiting, and request routing
7. Use event-driven architecture for asynchronous operations between services

## Microservice Organization

1. Backend must be organized into the following microservices:
   - Authentication Service
   - Core Service
   - Operations Service
   - Finance Service
   - Notification Service
   - Reporting Service
2. Each service must have its own database and not directly access other service databases
3. Services must be containerized with Docker and deployable to Railway.com
4. Each service must expose a well-documented REST API

## Hexagonal Architecture Rules

1. Each microservice must implement hexagonal architecture with the following layers:
   - API Layer (controllers, routes, middlewares)
   - Application Layer (use cases, services)
   - Domain Layer (models, entities, value objects)
   - Infrastructure Layer (repositories, database, external services)
2. Dependencies must flow from outer layers to inner layers only
3. Domain layer must not have dependencies on infrastructure or frameworks
4. Business logic must be isolated in the application and domain layers
5. Infrastructure implementations must be replaceable without changing domain logic

## Service Structure Rules

1. Each service must follow the standardized folder structure:
   ```
   /service-name
     /src
       /api              # API Layer
         /controllers    # Request handlers
         /routes         # Route definitions
         /middlewares    # API middlewares
         /validators     # Request validation
       /application      # Application Layer
         /use-cases      # Business logic use cases
         /services       # Service implementations
         /dtos           # Data transfer objects
       /domain           # Domain Layer
         /models         # Domain models/entities
         /events         # Domain events
         /value-objects  # Value objects
       /infrastructure   # Infrastructure Layer
         /repositories   # Data access implementations
         /database       # Database connection
         /external       # External service clients
       /config           # Configuration
       /utils            # Utilities and helpers
     package.json        # Dependencies
     server.js          # Entry point
   ```
2. All files must follow the naming convention: camelCase for files, kebab-case for directories
3. Each service must have a clear entry point (server.js) that initializes the application
4. Configuration must be separated from code and loaded from environment variables

## API Gateway Rules

1. API Gateway must implement the following functionalities:
   - Request routing to appropriate microservices
   - Authentication and authorization
   - Rate limiting and throttling
   - Request/response transformation
   - API documentation
   - Caching
   - Circuit breaking
   - Logging and monitoring
2. API Gateway must be implemented using Express.js
3. Authentication must be JWT-based with refresh token mechanism
4. API documentation must be generated using Swagger/OpenAPI
5. Rate limiting must be implemented to prevent abuse

## Database Rules

1. MongoDB must be used as the primary database with Mongoose ODM
2. Each service must have its own database namespace
3. Database schemas must include proper validation
4. Indexes must be created for frequently queried fields
5. Database operations must use transactions for data consistency
6. Connection pooling must be implemented for efficiency

## Event-Driven Communication Rules

1. Services must communicate asynchronously using an event bus
2. Events must be published with appropriate routing keys
3. Event subscribers must handle errors gracefully
4. Event messages must be persisted for reliability
5. Dead letter queues must be implemented for failed messages
6. Event schemas must be well-defined and versioned

## Authentication and Authorization Rules

1. Authentication must be implemented using JWT with appropriate expiration
2. Refresh tokens must be used for token renewal
3. Authorization must be implemented using role-based access control
4. Sensitive routes must be protected with appropriate middleware
5. Passwords must be hashed using bcrypt with appropriate salt rounds
6. Token validation must be performed on all protected routes

## Error Handling Rules

1. All services must implement standardized error handling
2. Error responses must follow a consistent format
3. Appropriate HTTP status codes must be used
4. Error details must be logged for monitoring
5. Sensitive error information must not be exposed to clients
6. Custom error classes must be used for different error types

## Deployment Rules

1. All services must be containerized using Docker
2. Deployment must be automated through CI/CD pipelines
3. Environment variables must be used for configuration
4. Health check endpoints must be implemented
5. Services must be deployed to Railway.com
6. Container images must be optimized for size and security