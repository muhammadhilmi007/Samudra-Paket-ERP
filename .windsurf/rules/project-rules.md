---
trigger: always_on
---

# Project Rules for Samudra Paket ERP

## Project Overview
Samudra Paket ERP is a comprehensive enterprise resource planning system for PT. Sarana Mudah Raya, a logistics and shipping company. The system integrates all business processes including pickup management, shipment tracking, delivery management, financial operations, and reporting.

## System Architecture
- Implement microservice architecture with API Gateway pattern
- Each microservice must handle a specific business domain
- Services must communicate through well-defined APIs
- Implement circuit breaker patterns for fault tolerance
- Use event-driven architecture for asynchronous operations

## Tech Stack
- **Frontend Web**: Next.js (Version 15) App Router with JavaScript, Tailwind CSS (Version 4), Shadcn UI
- **Frontend Mobile**: React Native (Expo) with TypeScript
- **Backend**: Node.js, Express.js with JavaScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Deployment**: Railway.com
- **CI/CD**: GitHub Actions

## Development Standards

### Code Organization
- Organize code in a monorepo structure using Turborepo
- Follow domain-driven design principles
- Implement clean architecture patterns
- Separate concerns between UI, business logic, and data access

### Naming Conventions
- **Directories**: Use kebab-case (e.g., `user-management`)
- **Files**: Use camelCase (e.g., `userController.js`)
- **Components**: Use PascalCase (e.g., `UserProfile.jsx`)
- **Variables/Functions**: Use camelCase (e.g., `getUserData`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)

### Documentation
- Document all APIs using Swagger and Postman
- Include JSDoc comments for all functions and classes
- Maintain up-to-date README files for each module
- Document database schema changes

## Security Requirements
- Implement JWT-based authentication with refresh token mechanism
- Use RBAC (Role-Based Access Control) for authorization
- Apply principle of least privilege for all operations
- Encrypt sensitive data at rest and in transit
- Implement rate limiting for all public APIs
- Follow OWASP security best practices

## Performance Standards
- Web pages must load within 2 seconds
- API responses must be returned within 500ms
- Mobile app must function with limited connectivity
- Implement caching strategies for frequently accessed data
- Optimize database queries with proper indexing

## Testing Requirements
- Minimum 80% code coverage for unit tests
- Implement integration tests for all critical paths
- Create end-to-end tests for key user journeys
- Perform load testing for high-traffic endpoints
- Conduct security testing for all APIs

## Deployment & DevOps
- Use containerization with Docker
- Implement CI/CD pipeline with GitHub Actions
- Maintain separate environments for development, staging, and production
- Implement automated rollback mechanisms
- Set up comprehensive monitoring and alerting

## Mobile-Specific Guidelines
- Design for offline-first operation
- Implement data synchronization with conflict resolution
- Optimize battery usage for field operations
- Support device integrations (camera, GPS, etc.)
- Ensure responsive design for various screen sizes