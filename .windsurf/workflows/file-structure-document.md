---
description: How to understand and navigate the file structure of Samudra Paket ERP
---

# File Structure Document Workflow

This workflow guides you through understanding and navigating the file structure of the Samudra Paket ERP system, focusing on the monorepo organization, naming conventions, and module structure.

## Steps to Follow

1. Review the Turborepo monorepo structure:
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

2. Understand the applications organization in the `apps` directory:
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

3. Follow the naming conventions:
   - Directories: kebab-case (e.g., `pickup-service`)
   - Utility files: camelCase (e.g., `apiService.js`)
   - Component files: PascalCase (e.g., `Button.jsx`)
   - Configuration files: kebab-case (e.g., `eslint-config.js`)

4. Implement the Next.js App Router structure for web application:
   - Atomic Design methodology (atoms, molecules, organisms, templates, pages)
   - Mobile-first responsive design approach
   - State management with Redux Toolkit and React Query

5. Follow the React Native with Expo structure for mobile application:
   - Offline-first functionality with WatermelonDB
   - Device integration features (camera, GPS, signature capture)
   - Optimized for battery life and data usage

## Reference Documentation

For more detailed information, refer to the full File Structure Document at:
`d:\samudra-erp\documentation\file-structure-document.md`