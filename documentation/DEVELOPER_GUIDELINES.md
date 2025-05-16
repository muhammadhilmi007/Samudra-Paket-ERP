# Developer Guidelines for Samudra Paket ERP

## Introduction

This document outlines the development standards and practices for the Samudra Paket ERP project. All developers working on this project are expected to follow these guidelines to ensure code quality, maintainability, and consistency across the codebase.

## Architecture Overview

Samudra Paket ERP follows a microservice architecture with an API Gateway pattern. The application is structured as a monorepo using Turborepo, with the following key components:

- **API Gateway**: Central entry point for all client requests
- **Microservices**: Domain-specific services (Auth, Core, Operations, Finance, Notification, Reporting)
- **Web Frontend**: Next.js application with JavaScript
- **Mobile App**: React Native with Expo and TypeScript
- **Shared Packages**: Common utilities, components, and configurations

Each microservice follows hexagonal architecture with clear separation between:

- API Layer (controllers, routes, middlewares)
- Application Layer (use cases, services)
- Domain Layer (models, entities, value objects)
- Infrastructure Layer (repositories, database, external services)

## Coding Standards

### General Guidelines

1. Follow the principle of **Separation of Concerns**
2. Write **clean, readable, and self-documenting** code
3. Include **JSDoc comments** for all functions, classes, and modules
4. Follow the **DRY (Don't Repeat Yourself)** principle
5. Write **unit tests** for all business logic
6. Keep functions **small and focused** on a single responsibility
7. Use **meaningful variable and function names** that describe their purpose

### JavaScript/TypeScript Standards

1. Follow the **Airbnb JavaScript Style Guide**
2. Use **ES2022 features** for all JavaScript code
3. Use **TypeScript** for the mobile application
4. Use **async/await** for all asynchronous operations
5. Implement proper **error handling** for all async operations with try/catch blocks
6. Use **destructuring** for object and array access where appropriate
7. Prefer **const** over let, and avoid var completely
8. Use **optional chaining** and **nullish coalescing** operators for safer property access

### Frontend Standards

1. Follow **Atomic Design** methodology (atoms, molecules, organisms, templates, pages)
2. Use **Tailwind CSS** for styling with the defined color palette (Primary: #2563EB, Secondary: #10B981, etc.)
3. Implement **mobile-first** responsive design approach with defined breakpoints
4. Use **Redux Toolkit** for global state and **React Query** for server state
5. Create forms with **React Hook Form** and **Zod** validation
6. Design all UI with **WCAG 2.1 Level AA** compliance in mind
7. Use **Shadcn UI** components as foundation

### Backend Standards

1. Follow **RESTful API** design principles
2. Use proper **HTTP methods** for operations (GET, POST, PUT, DELETE, PATCH)
3. Implement **consistent request/response** format across all services
4. Use proper **HTTP status codes** for different scenarios
5. Implement proper **validation** for all API requests using Joi or Zod
6. Store **sensitive configuration** in environment variables, never in code
7. Implement **proper error handling** with descriptive error messages

### Mobile Development Standards

1. Design for **offline-first** operation with WatermelonDB
2. Implement **data synchronization** with conflict resolution
3. Optimize for **battery life** and **data usage** for field operations
4. Support **device integrations** (camera, GPS, signature capture)
5. Implement **secure storage** for sensitive data
6. Design for **one-handed operation** where possible
7. Provide clear **offline indicators** and sync status to users

## Git Workflow

1. Use **feature branches** for all new development
2. Follow **Conventional Commits** for commit messages
3. Submit changes via **Pull Requests**
4. Ensure all tests pass before merging
5. Keep PRs focused and reasonably sized
6. Use **semantic versioning** for releases

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

## Testing Standards

1. Write **unit tests** for all business logic with Jest
2. Implement **integration tests** for API endpoints with Supertest
3. Create **end-to-end tests** for critical user flows
4. Maintain minimum **80% code coverage** for all services
5. Test **error handling** and edge cases
6. Write tests for **mobile components** with React Testing Library

## Code Review Guidelines

1. Review code for **functionality** and **correctness**
2. Check for adherence to **coding standards**
3. Verify **test coverage** and quality
4. Look for potential **security issues**
5. Assess **performance** considerations
6. Provide **constructive feedback**

## Development Workflow

1. **Plan**: Understand requirements and design before coding
2. **Develop**: Write code following the guidelines
3. **Test**: Write tests and ensure they pass
4. **Review**: Submit for code review
5. **Refine**: Address feedback from code review
6. **Merge**: Merge changes to the main branch
7. **Deploy**: Deploy changes through the CI/CD pipeline

## Conclusion

Following these guidelines will help ensure a high-quality, maintainable codebase for the Samudra Paket ERP project. If you have any questions or suggestions for improving these guidelines, please discuss with the team.
