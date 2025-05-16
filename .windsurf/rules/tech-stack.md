---
trigger: always_on
---

# Tech Stack Rules

## Frontend Technologies

### Web Application

1. **Core Framework**
   - Next.js (Version 15) with App Router
   - React (Version 19)
   - JavaScript ES2022

2. **Styling**
   - Tailwind CSS (Version 4)
   - Shadcn UI (Version 2) as component library foundation
   - PostCSS for processing

3. **State Management**
   - Redux Toolkit (Version 2) for global state
   - React Query (Version 3) for server state

4. **Form Handling**
   - React Hook Form (Version 7)
   - Zod (Version 3) for validation

5. **Data Fetching**
   - Axios (Version 1) for API requests
   - React Query for caching and state management

6. **Additional Libraries**
   - next-i18next (Version 14) for internationalization
   - Chart.js (Version 4) for data visualization
   - date-fns (Version 2) for date manipulation
   - Framer Motion (Version 10) for animations

### Mobile Application

1. **Core Framework**
   - React Native (Version 0.72)
   - Expo (Version 49)
   - TypeScript (Version 5)

2. **Navigation**
   - React Navigation (Version 6)

3. **State Management**
   - Redux Toolkit (Version 2) for global state
   - React Query (Version 5) for server state

4. **Offline Data**
   - WatermelonDB (Version 0.27) for reactive database

5. **UI Components**
   - React Native Paper (Version 5) for Material Design

6. **Device Integration**
   - React Native Maps (Version 1.7)
   - Expo Camera (Version 13)
   - Expo Location (Version 16)
   - React Native Signature Canvas (Version 4)
   - React Native SVG (Version 13)

## Backend Technologies

### Core Technologies

1. **Runtime & Framework**
   - Node.js (Version 22 LTS)
   - Express.js (Version 5)
   - JavaScript ES2022

2. **Database**
   - MongoDB (Version 6)
   - Mongoose (Version 7) for ODM
   - Redis (Version 7) for caching

3. **Authentication & Security**
   - JSON Web Token (Version 9)
   - bcrypt (Version 5) for password hashing
   - Joi (Version 17) for validation

4. **Logging & File Handling**
   - Winston (Version 3) for logging
   - Multer (Version 1) for file uploads
   - Sharp (Version 0.32) for image processing
   - Nodemailer (Version 6) for email

### API and Documentation

1. **API Documentation**
   - Swagger/OpenAPI (Version 5)
   - Postman for testing and documentation

2. **Middleware**
   - Express Validator (Version 7)
   - CORS (Version 2)
   - Helmet (Version 7) for security headers
   - Express Rate Limit (Version 6)
   - Compression (Version 1)

### Messaging and Events

1. **Message Broker**
   - RabbitMQ (Version 3.12)
   - amqplib (Version 0.10) for Node.js client

2. **Real-time Communication**
   - Socket.IO (Version 4)

## DevOps and Infrastructure

### Containerization

1. **Docker & Orchestration**
   - Docker (Version 24)
   - Docker Compose (Version 2)

### CI/CD

1. **Continuous Integration/Deployment**
   - GitHub Actions

### Hosting

1. **Deployment Platform**
   - Railway.com for application deployment
   - MongoDB Atlas for database
   - Redis Cloud for caching
   - Cloudinary for media storage

### Monitoring

1. **Observability**
   - Prometheus (Version 2) for monitoring
   - Grafana (Version 10) for visualization
   - ELK Stack for logging
   - Sentry for error tracking

## Development Tools

### Code Quality

1. **Linting & Formatting**
   - ESLint (Version 8)
   - Prettier (Version 3)
   - Husky (Version 8) for git hooks
   - lint-staged (Version 15)

### Project Management

1. **Monorepo & Package Management**
   - Turborepo (Version 2)
   - npm (Version 10)
   - Conventional Commits
   - Semantic Versioning

## External Integrations

### Maps and Geolocation

1. **Mapping Services**
   - Google Maps API
   - Mapbox as alternative

### Payment Processing

1. **Payment Gateways**
   - Midtrans for Indonesian market
   - Xendit as alternative

### Notifications

1. **Communication Services**
   - Twilio for SMS and WhatsApp
   - SendGrid for email
   - Firebase Cloud Messaging for push notifications