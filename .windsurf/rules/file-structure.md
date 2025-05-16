---
trigger: always_on
---

# File Structure Rules

## Monorepo Structure

1. Use Turborepo for monorepo management with the following root structure:
   ```
   /samudra-app                     # Root directory
   ├── apps/                        # Application packages
   ├── packages/                    # Shared packages
   ├── docs/                        # Project documentation
   ├── documentation/               # Technical documentation
   ├── software-docs/               # Software requirements
   ├── scripts/                     # Utility scripts
   └── .windsurf/                   # Windsurf AI configuration
   ```

2. Organize applications in the `apps` directory:
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

3. Organize shared packages in the `packages` directory:
   ```
   /packages
   ├── ui/                          # Shared UI components
   ├── config/                      # Shared configuration
   ├── utils/                       # Shared utilities
   ├── api-client/                  # API client for frontend
   ├── logger/                      # Logging utilities
   ├── validation/                  # Validation schemas
   └── types/                       # Shared TypeScript types
   ```

## Naming Conventions

1. **Directories**: Use kebab-case for directory names (e.g., `pickup-service`)
2. **Files**: 
   - Use camelCase for utility files (e.g., `apiService.js`)
   - Use PascalCase for component files (e.g., `Button.jsx`)
   - Use kebab-case for configuration files (e.g., `eslint-config.js`)
3. **Components**: 
   - Use PascalCase for component names
   - Prefix higher-order components with `with` (e.g., `withAuth`)
   - Prefix custom hooks with `use` (e.g., `useAuth`)
4. **API Endpoints**: 
   - Use kebab-case for endpoint paths (e.g., `/api/pickup-requests`)
   - Use plural nouns for collection endpoints (e.g., `/api/shipments`)

## Web Application Structure

1. Follow Next.js App Router structure for web application:
   ```
   /apps/web
   ├── public/                      # Static assets
   ├── src/
   │   ├── app/                     # App Router pages
   │   ├── components/              # React components
   │   │   ├── atoms/               # Basic building blocks
   │   │   ├── molecules/           # Simple component groups
   │   │   ├── organisms/           # Complex components
   │   │   ├── templates/           # Page layouts
   │   │   └── pages/               # Page components
   │   ├── hooks/                   # Custom React hooks
   │   ├── lib/                     # Utility functions
   │   ├── store/                   # State management
   │   ├── services/                # API services
   │   └── styles/                  # Global styles
   ```

## Mobile Application Structure

1. Follow React Native with Expo structure for mobile application:
   ```
   /apps/mobile
   ├── src/
   │   ├── app/                     # App entry points
   │   ├── components/              # React components
   │   ├── navigation/              # Navigation configuration
   │   ├── screens/                 # Application screens
   │   ├── services/                # API services
   │   ├── store/                   # State management
   │   ├── hooks/                   # Custom React hooks
   │   ├── utils/                   # Utility functions
   │   ├── database/                # Offline database
   │   └── theme/                   # Styling and theming
   ```

## Backend Service Structure

1. Follow hexagonal architecture for backend services:
   ```
   /apps/[service-name]
   ├── src/
   │   ├── api/                     # API Layer
   │   │   ├── controllers/         # Request handlers
   │   │   ├── routes/              # Route definitions
   │   │   ├── middlewares/         # API middlewares
   │   │   └── validators/          # Request validation
   │   ├── application/             # Application Layer
   │   │   ├── use-cases/           # Business logic
   │   │   ├── services/            # Service implementations
   │   │   └── dtos/                # Data transfer objects
   │   ├── domain/                  # Domain Layer
   │   │   ├── models/              # Domain models
   │   │   ├── entities/            # Business entities
   │   │   └── events/              # Domain events
   │   ├── infrastructure/          # Infrastructure Layer
   │   │   ├── repositories/        # Data access
   │   │   ├── database/            # Database connection
   │   │   └── external/            # External services
   │   ├── config/                  # Configuration
   │   └── utils/                   # Utilities
   ```

## Documentation Standards

1. Use JSDoc comments for functions, classes, and components
2. Include descriptions, parameter types, return types, and examples
3. Document complex algorithms and business logic
4. Keep documentation up-to-date with code changes