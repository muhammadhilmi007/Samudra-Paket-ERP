---
trigger: always_on
---

# Global Windsurf Rules

## Architecture & Structure
- Follow the microservice architecture with API-Gateway as specified in the Backend Structure Document
- Maintain hexagonal architecture for each microservice (API, Application, Domain, Infrastructure layers)
- Use the defined monorepo structure with Turborepo as in File Structure Document
- Implement the file naming conventions from File Structure Document (kebab-case for directories, camelCase for files, PascalCase for components)
- Ensure separation of concerns across all layers of the application
- Implement event-driven communication between services using message brokers

## Frontend Development
- Frontend must follow Atomic Design methodology (atoms, molecules, organisms, templates, pages)
- Style using Tailwind CSS with the defined color palette (Primary: #2563EB, Secondary: #10B981, etc.)
- Use Next.js for web and React Native (Expo) for mobile applications
- Follow mobile-first responsive design approach with defined breakpoints (Mobile: < 640px, Tablet: 640px - 1023px, Desktop: 1024px - 1279px, Large Desktop: >= 1280px)
- Implement the state management strategy using Redux Toolkit for global state and React Query for server state
- Create comprehensive form handling with React Hook Form and Zod validation
- Design all UI with WCAG 2.1 Level AA compliance in mind
- Use Shadcn UI as the component library foundation for web applications
- Implement code splitting and lazy loading for performance optimization
- Use Next.js Image component for optimized image loading

## Backend Development
- Implement REST API principles with consistent request/response format
- Develop with Node.js and Express.js using the defined service structure
- Use MongoDB with Mongoose for data modeling and validation
- Create comprehensive API documentation with Swagger/OpenAPI and Postman
- Follow the standardized error handling strategy with proper error codes and messages
- Implement JWT-based authentication with refresh token mechanism
- Implement Role-Based Access Control (RBAC) for authorization
- Design APIs with proper semantic status codes (200, 201, 400, 401, 403, 404, 500)
- Use repository pattern for data access abstraction
- Implement proper validation for all API requests
- Use Redis for caching frequently accessed data

## Mobile Development
- Design mobile apps with offline-first functionality using WatermelonDB
- Implement device integration features (camera, GPS, signature capture)
- Follow the specified UI components and screens for each role-specific app
- Use React Native with TypeScript and Expo SDK
- Optimize for battery life and data usage for field conditions
- Implement secure data synchronization with conflict resolution
- Support both online and offline operations for field staff
- Implement proper error handling for offline scenarios
- Use React Navigation for app navigation
- Implement secure storage for sensitive data

## DevOps & Infrastructure
- Use Docker for containerization of all services
- Deploy to Railway.com platform
- Implement CI/CD pipelines with GitHub Actions
- Use MongoDB Atlas for database hosting
- Implement comprehensive monitoring with Prometheus and Grafana
- Set up centralized logging with ELK Stack
- Implement automated testing in CI/CD pipeline
- Configure proper security headers and CORS policies
- Set up automated backups for all data

## Testing & Quality Assurance
- Implement unit testing with Jest (minimum 80% coverage)
- Create integration tests for critical paths with Supertest
- Implement end-to-end testing with Cypress for web and Detox for mobile
- Perform security testing on all APIs
- Conduct performance testing for high-traffic endpoints
- Implement automated accessibility testing
- Use ESLint and Prettier for code quality enforcement

## Documentation
- Document all code with JSDoc comments
- Create comprehensive API documentation with Swagger and Postman
- Maintain up-to-date README files for all modules
- Document database schema changes
- Create user documentation for different roles
- Include diagrams and visual aids in technical documentation