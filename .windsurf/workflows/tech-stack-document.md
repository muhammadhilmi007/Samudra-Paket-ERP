---
description: How to understand the technology stack of Samudra Paket ERP
---

# Tech Stack Document Workflow

This workflow guides you through understanding the technology stack of the Samudra Paket ERP system, focusing on the tools, frameworks, and libraries used in the project.

## Steps to Follow

1. Review the frontend web technologies:
   - Next.js (Version 15) with App Router
   - React (Version 19) with JavaScript ES2022
   - Tailwind CSS (Version 4) with Shadcn UI (Version 2)
   - Redux Toolkit (Version 2) for global state
   - React Query (Version 3) for server state
   - React Hook Form (Version 7) with Zod (Version 3) for validation
   - Axios (Version 1) for API requests

2. Understand the mobile application technologies:
   - React Native (Version 0.72)
   - Expo (Version 49) with TypeScript (Version 5)
   - React Navigation (Version 6)
   - WatermelonDB (Version 0.27) for offline data
   - React Native Paper (Version 5)
   - Device integration libraries (Maps, Camera, Location, Signature)

3. Study the backend technologies:
   - Node.js (Version 22 LTS)
   - Express.js (Version 5) with JavaScript ES2022
   - MongoDB (Version 6) with Mongoose (Version 7)
   - Redis (Version 7) for caching
   - JSON Web Token (Version 9) with bcrypt (Version 5)
   - Joi (Version 17) for validation
   - Swagger/OpenAPI (Version 5) for documentation

4. Examine the DevOps and infrastructure stack:
   - Docker (Version 24) with Docker Compose (Version 2)
   - GitHub Actions for CI/CD
   - Railway.com for application deployment
   - MongoDB Atlas for database hosting
   - Redis Cloud for caching
   - Cloudinary for media storage
   - Prometheus (Version 2) and Grafana (Version 10) for monitoring

5. Understand the development tools:
   - ESLint (Version 8) and Prettier (Version 3)
   - Husky (Version 8) for git hooks
   - Turborepo (Version 2) for monorepo management
   - Jest for unit testing
   - Cypress for E2E web testing
   - Detox for E2E mobile testing
   - TypeScript for type safety

## Reference Documentation

For more detailed information, refer to the full Tech Stack Document at:
`d:\samudra-erp\documentation\tech-stack-document.md`