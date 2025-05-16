---
trigger: always_on
---

# Backend Guidelines

## Coding Standards

1. Use JavaScript ES2022 features for all backend services
2. Follow Airbnb JavaScript Style Guide for code formatting and style
3. Use async/await for all asynchronous operations instead of callbacks or promises
4. Implement proper error handling for all async operations with try/catch blocks
5. Use meaningful variable and function names that describe their purpose
6. Keep functions small and focused on a single responsibility
7. Document all functions, classes, and modules with JSDoc comments
8. Use destructuring for object and array access where appropriate
9. Prefer const over let, and avoid var completely
10. Use optional chaining and nullish coalescing operators for safer property access

## API Design Guidelines

1. Follow RESTful API design principles for all endpoints
2. Use plural nouns for resource endpoints (e.g., /users instead of /user)
3. Use proper HTTP methods for operations (GET, POST, PUT, DELETE, PATCH)
4. Implement consistent request/response format across all services
5. Use proper HTTP status codes for different scenarios:
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Internal Server Error
6. Include pagination, sorting, and filtering for collection endpoints
7. Version APIs in the URL path (e.g., /api/v1/users)
8. Implement proper validation for all API requests using Joi or Zod
9. Return descriptive error messages that help clients understand the issue
10. Use query parameters for filtering and sorting, path parameters for resource identification

## Security Guidelines

1. Store sensitive configuration in environment variables, never in code
2. Implement rate limiting to prevent abuse and DoS attacks
3. Use HTTPS for all communications in production
4. Hash passwords using bcrypt with a minimum of 10 salt rounds
5. Implement proper input validation to prevent injection attacks
6. Set secure and HTTP-only flags for cookies
7. Implement proper CORS configuration
8. Use parameterized queries to prevent SQL/NoSQL injection
9. Implement proper access control checks for all protected resources
10. Regularly update dependencies to address security vulnerabilities
11. Implement proper logging without sensitive information
12. Use content security policy headers
13. Implement JWT with proper expiration and refresh token rotation

## Database Guidelines

1. Create proper indexes for frequently queried fields
2. Implement schema validation for all MongoDB collections
3. Use transactions for operations that modify multiple documents
4. Implement proper error handling for database operations
5. Use connection pooling for efficient database connections
6. Implement proper data pagination for large collections
7. Use projection to limit fields returned from queries
8. Implement proper data validation before saving to database
9. Use aggregation pipeline for complex queries instead of multiple queries
10. Implement proper database migration strategy for schema changes
11. Use TTL indexes for temporary data that should expire
12. Implement proper backup and restore procedures

## Testing Guidelines

1. Write unit tests for all business logic with Jest
2. Implement integration tests for API endpoints with Supertest
3. Maintain minimum 80% code coverage for all services
4. Use mock objects for external dependencies in unit tests
5. Implement proper test database setup and teardown
6. Write tests for error handling and edge cases
7. Implement proper CI/CD pipeline for automated testing
8. Use test-driven development (TDD) approach when appropriate
9. Separate test environment from development and production
10. Implement performance tests for critical endpoints

## Logging and Monitoring Guidelines

1. Implement structured logging with proper log levels (error, warn, info, debug)
2. Include request ID in logs for request tracing across services
3. Log all API requests and responses at appropriate levels
4. Implement proper error logging with stack traces
5. Use a centralized logging system for all services
6. Implement health check endpoints for all services
7. Monitor service performance and resource usage
8. Set up alerts for critical errors and performance issues
9. Implement proper logging middleware for Express.js
10. Use correlation IDs for tracking requests across services

## Documentation Guidelines

1. Document all APIs using Swagger/OpenAPI specification
2. Include example requests and responses in API documentation
3. Document all environment variables and configuration options
4. Maintain up-to-date README files for each service
5. Document database schema and relationships
6. Include setup and deployment instructions
7. Document service dependencies and integration points
8. Maintain changelog for API changes
9. Document error codes and their meanings
10. Include architecture diagrams and service interactions

## Performance Guidelines

1. Implement proper caching strategy using Redis
2. Optimize database queries with proper indexes
3. Use compression for API responses
4. Implement connection pooling for external services
5. Use streaming for large data transfers
6. Implement proper pagination for large data sets
7. Optimize file uploads and downloads
8. Use worker threads for CPU-intensive operations
9. Implement proper timeout handling for external service calls
10. Use circuit breakers for fault tolerance

## Deployment and DevOps Guidelines

1. Use Docker for containerization of all services
2. Implement CI/CD pipeline with GitHub Actions
3. Use environment-specific configuration
4. Implement blue-green deployment strategy
5. Use semantic versioning for service releases
6. Implement proper logging and monitoring in production
7. Use infrastructure as code for deployment
8. Implement proper backup and restore procedures
9. Use container orchestration for service management
10. Implement proper secret management