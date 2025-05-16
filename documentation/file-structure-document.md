# File Structure Document

## Overview

This document outlines the file and directory structure for the Samudra Paket ERP system. It serves as a guide for developers to understand the organization of the codebase and to maintain consistency across the project.

## Monorepo Structure

The project follows a monorepo architecture using Turborepo, which allows for sharing code and configuration across multiple applications and packages.

```
/sarana-app                      # Root directory
├── .github/                     # GitHub configuration
│   └── workflows/               # GitHub Actions workflows
├── .husky/                      # Git hooks configuration
├── .vscode/                     # VS Code configuration
├── .windsurf/                   # Windsurf AI configuration
│   └── rules/                   # Project and global rules
├── apps/                        # Application packages
├── packages/                    # Shared packages
├── docs/                        # Project documentation
├── documentation/               # Technical documentation
├── software-docs/               # Software requirements and design docs
├── scripts/                     # Utility scripts
├── .eslintrc.js                 # ESLint configuration
├── .gitignore                   # Git ignore configuration
├── .prettierrc                  # Prettier configuration
├── package.json                 # Root package configuration
├── README.md                    # Project overview
└── turbo.json                   # Turborepo configuration
```

## Applications Structure

The `apps` directory contains all the application packages, including frontend and backend services.

```
/apps
├── web/                         # Next.js web application
├── mobile/                      # React Native mobile application
├── api-gateway/                 # API Gateway service
├── auth-service/                # Authentication service
├── core-service/                # Core service
├── operations-service/          # Operations service
├── finance-service/             # Finance service
├── notification-service/        # Notification service
└── reporting-service/           # Reporting service
```

## Shared Packages Structure

The `packages` directory contains shared code and configuration that can be used across multiple applications.

```
/packages
├── ui/                          # Shared UI components
├── config/                      # Shared configuration
│   ├── eslint-config/           # ESLint configuration
│   └── tsconfig/                # TypeScript configuration
├── utils/                       # Shared utilities
├── api-client/                  # API client for frontend applications
├── logger/                      # Logging utilities
├── validation/                  # Validation schemas
└── types/                       # Shared TypeScript types
```

## Web Application Structure

The Next.js web application follows a structured organization for components, pages, and other assets.

```
/apps/web
├── public/                      # Static assets
│   ├── favicon.ico              # Favicon
│   ├── logo.svg                 # Logo
│   └── images/                  # Image assets
├── src/                         # Source code
│   ├── components/              # React components (Atomic Design)
│   │   ├── atoms/               # Basic building blocks
│   │   ├── molecules/           # Simple component groups
│   │   ├── organisms/           # Complex components
│   │   ├── templates/           # Page layouts
│   │   └── pages/               # Page components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   ├── pages/                   # Next.js pages
│   │   ├── _app.js              # App component
│   │   ├── _document.js         # Document component
│   │   ├── index.js             # Home page
│   │   ├── auth/                # Authentication pages
│   │   ├── dashboard/           # Dashboard pages
│   │   ├── shipments/           # Shipment management pages
│   │   ├── pickups/             # Pickup management pages
│   │   ├── deliveries/          # Delivery management pages
│   │   ├── vehicles/            # Vehicle management pages
│   │   ├── finance/             # Finance pages
│   │   ├── reports/             # Reporting pages
│   │   ├── settings/            # Settings pages
│   │   └── api/                 # API routes
│   ├── services/                # API service functions
│   ├── store/                   # Redux store
│   │   ├── index.js             # Store configuration
│   │   └── slices/              # Redux slices
│   ├── styles/                  # Global styles
│   │   ├── globals.css          # Global CSS
│   │   └── theme.js             # Theme configuration
│   └── types/                   # TypeScript type definitions
├── .env.local                   # Local environment variables
├── .env.development             # Development environment variables
├── .env.production              # Production environment variables
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── jest.config.js               # Jest configuration
├── package.json                 # Package configuration
└── tsconfig.json                # TypeScript configuration
```

## Mobile Application Structure

The React Native mobile application follows a structured organization for components, screens, and other assets.

```
/apps/mobile
├── assets/                      # Static assets
│   ├── fonts/                   # Font files
│   ├── images/                  # Image assets
│   └── icons/                   # Icon assets
├── src/                         # Source code
│   ├── components/              # React components (Atomic Design)
│   │   ├── atoms/               # Basic building blocks
│   │   ├── molecules/           # Simple component groups
│   │   ├── organisms/           # Complex components
│   │   └── templates/           # Screen layouts
│   ├── hooks/                   # Custom React hooks
│   ├── navigation/              # Navigation configuration
│   │   ├── index.tsx            # Navigation entry point
│   │   ├── AuthNavigator.tsx    # Authentication navigation
│   │   ├── MainNavigator.tsx    # Main app navigation
│   │   └── types.ts             # Navigation types
│   ├── screens/                 # Application screens
│   │   ├── auth/                # Authentication screens
│   │   ├── dashboard/           # Dashboard screen
│   │   ├── pickup/              # Pickup screens
│   │   ├── delivery/            # Delivery screens
│   │   ├── collection/          # Collection screens
│   │   ├── settings/            # Settings screens
│   │   └── profile/             # Profile screens
│   ├── services/                # API service functions
│   ├── store/                   # Redux store
│   │   ├── index.ts             # Store configuration
│   │   └── slices/              # Redux slices
│   ├── theme/                   # Theme configuration
│   │   ├── colors.ts            # Color definitions
│   │   ├── spacing.ts           # Spacing definitions
│   │   └── typography.ts        # Typography definitions
│   ├── utils/                   # Utility functions
│   ├── database/                # WatermelonDB configuration
│   │   ├── index.ts             # Database entry point
│   │   ├── schema.ts            # Database schema
│   │   └── models/              # Database models
│   └── types/                   # TypeScript type definitions
├── .env                         # Environment variables
├── app.json                     # Expo configuration
├── babel.config.js              # Babel configuration
├── metro.config.js              # Metro configuration
├── package.json                 # Package configuration
└── tsconfig.json                # TypeScript configuration
```

## Backend Service Structure

Each backend microservice follows a hexagonal architecture pattern with a consistent structure.

```
/apps/[service-name]
├── src/                         # Source code
│   ├── api/                     # API Layer
│   │   ├── controllers/         # Request handlers
│   │   ├── routes/              # Route definitions
│   │   ├── middlewares/         # API middlewares
│   │   ├── validators/          # Request validation
│   │   └── docs/                # API documentation
│   ├── application/             # Application Layer
│   │   ├── services/            # Business logic
│   │   ├── use-cases/           # Use case implementations
│   │   └── dtos/                # Data Transfer Objects
│   ├── domain/                  # Domain Layer
│   │   ├── models/              # Domain models
│   │   ├── entities/            # Business entities
│   │   ├── value-objects/       # Value objects
│   │   └── events/              # Domain events
│   ├── infrastructure/          # Infrastructure Layer
│   │   ├── repositories/        # Data access
│   │   ├── database/            # Database connection
│   │   ├── external/            # External service clients
│   │   ├── messaging/           # Message queue clients
│   │   └── storage/             # File storage
│   ├── config/                  # Configuration
│   │   ├── index.js             # Configuration entry point
│   │   ├── database.js          # Database configuration
│   │   ├── messaging.js         # Messaging configuration
│   │   └── logger.js            # Logging configuration
│   ├── utils/                   # Utilities
│   ├── types/                   # Type definitions
│   └── server.js                # Entry point
├── .env                         # Environment variables
├── .env.development             # Development environment variables
├── .env.production              # Production environment variables
├── Dockerfile                   # Docker configuration
├── jest.config.js               # Jest configuration
├── package.json                 # Package configuration
└── tsconfig.json                # TypeScript configuration (if using TypeScript)
```

## Naming Conventions

### Directories

- Use kebab-case for directory names (e.g., `pickup-service`, `user-management`)
- Group related files in descriptive directories
- Use plural forms for collection directories (e.g., `components`, `services`)

### Files

- Use camelCase for utility files (e.g., `apiService.js`, `formatDate.js`)
- Use PascalCase for component files (e.g., `Button.jsx`, `UserProfile.tsx`)
- Use kebab-case for configuration files (e.g., `eslint-config.js`)
- Add file type suffixes when appropriate:
  - `.component.jsx` for React components
  - `.service.js` for service files
  - `.hook.js` for custom hooks
  - `.test.js` for test files
  - `.types.ts` for TypeScript type definitions

### Components

- Use PascalCase for component names (e.g., `Button`, `UserProfile`)
- Use descriptive names that reflect the component's purpose
- Prefix higher-order components with `with` (e.g., `withAuth`)
- Prefix custom hooks with `use` (e.g., `useAuth`)

### API Endpoints

- Use kebab-case for endpoint paths (e.g., `/api/pickup-requests`)
- Use plural nouns for collection endpoints (e.g., `/api/shipments`)
- Use nested paths for related resources (e.g., `/api/shipments/{id}/tracking`)

## Documentation

All code should be properly documented following these guidelines:

- Use JSDoc comments for functions, classes, and components
- Include descriptions, parameter types, return types, and examples
- Document complex algorithms and business logic
- Keep documentation up-to-date with code changes

Example:

```javascript
/**
 * Calculates the shipping cost based on weight, distance, and service type.
 *
 * @param {number} weight - The weight of the package in kilograms
 * @param {number} distance - The shipping distance in kilometers
 * @param {string} serviceType - The type of shipping service ('regular', 'express', 'same-day')
 * @returns {number} The calculated shipping cost
 *
 * @example
 * const cost = calculateShippingCost(5, 100, 'express');
 * // Returns: 75000
 */
function calculateShippingCost(weight, distance, serviceType) {
  // Implementation
}
```

## Conclusion

This file structure document provides a comprehensive guide for organizing code in the Samudra Paket ERP system. Following these conventions ensures consistency, maintainability, and scalability across the project. As the project evolves, this document should be updated to reflect any changes in the file structure or naming conventions.