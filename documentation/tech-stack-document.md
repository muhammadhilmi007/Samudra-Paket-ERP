# Tech Stack Document

## Overview

This document outlines the technology stack used in the Samudra Paket ERP system. It serves as a reference for developers to understand the technologies, frameworks, libraries, and tools used in the project.

## Frontend Technologies

### Web Application

| Technology | Version | Purpose |
|------------|---------|----------|
| Next.js | 15.x | React framework with SSR, SSG, and routing |
| React | 19.x | UI library for building component-based interfaces |
| JavaScript | ES2022 | Primary programming language for web frontend |
| Tailwind CSS | 4.x | Utility-first CSS framework for styling |
| Shadcn UI | 2.x | Component library built on Tailwind CSS |
| Redux Toolkit | 2.x | State management for global application state |
| React Query | 3.x | Data fetching, caching, and server state management |
| React Hook Form | 7.x | Form handling and validation |
| Zod | 3.x | Schema validation library |
| Axios | 1.x | HTTP client for API requests |
| next-i18next | 14.x | Internationalization for Next.js applications |
| Chart.js | 4.x | Data visualization library |
| date-fns | 2.x | Date utility library |
| Framer Motion | 10.x | Animation library |

### Mobile Application

| Technology | Version | Purpose |
|------------|---------|----------|
| React Native | 0.72.x | Framework for building native mobile apps |
| Expo | 49.x | Platform for universal React applications |
| TypeScript | 5.x | Typed superset of JavaScript for mobile development |
| React Navigation | 6.x | Navigation library for React Native |
| Redux Toolkit | 2.x | State management for global application state |
| React Query | 5.x | Data fetching and caching |
| WatermelonDB | 0.27.x | Reactive database for offline-first applications |
| React Native Paper | 5.x | Material Design components for React Native |
| React Native Maps | 1.7.x | Map integration for React Native |
| Expo Camera | 13.x | Camera access for document scanning |
| Expo Location | 16.x | Location services for GPS tracking |
| React Native Signature Canvas | 4.x | Signature capture component |
| React Native SVG | 13.x | SVG support for React Native |

## Backend Technologies

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|----------|
| Node.js | 22.x LTS | JavaScript runtime environment |
| Express.js | 5.x | Web application framework |
| JavaScript | ES2022 | Primary programming language for backend |
| MongoDB | 6.x | NoSQL database for data storage |
| Mongoose | 7.x | MongoDB object modeling for Node.js |
| Redis | 7.x | In-memory data structure store for caching |
| JSON Web Token (JWT) | 9.x | Authentication mechanism |
| bcrypt | 5.x | Password hashing library |
| Joi | 17.x | Schema validation |
| Winston | 3.x | Logging library |
| Multer | 1.x | Middleware for handling multipart/form-data |
| Sharp | 0.32.x | Image processing library |
| Nodemailer | 6.x | Email sending library |

### API and Documentation

| Technology | Version | Purpose |
|------------|---------|----------|
| Swagger/OpenAPI | 5.0 | API documentation |
| Postman | - | API testing and documentation |
| Express Validator | 7.x | Request validation middleware |
| CORS | 2.x | Cross-Origin Resource Sharing middleware |
| Helmet | 7.x | Security headers middleware |
| Express Rate Limit | 6.x | Rate limiting middleware |
| Compression | 1.x | Response compression middleware |

### Messaging and Events

| Technology | Version | Purpose |
|------------|---------|----------|
| RabbitMQ | 3.12.x | Message broker for event-driven architecture |
| amqplib | 0.10.x | AMQP client for Node.js |
| Socket.IO | 4.x | Real-time bidirectional event-based communication |

## DevOps and Infrastructure

### Containerization and Orchestration

| Technology | Version | Purpose |
|------------|---------|----------|
| Docker | 24.x | Containerization platform |
| Docker Compose | 2.x | Multi-container Docker applications |

### CI/CD

| Technology | Version | Purpose |
|------------|---------|----------|
| GitHub Actions | - | Continuous Integration and Deployment |
| Jest | 29.x | JavaScript testing framework |
| Supertest | 6.x | HTTP assertions for API testing |
| ESLint | 8.x | JavaScript linting utility |
| Prettier | 3.x | Code formatter |
| Husky | 8.x | Git hooks |
| lint-staged | 15.x | Run linters on staged files |

### Hosting and Deployment

| Technology | Version | Purpose |
|------------|---------|----------|
| Railway.com | - | PaaS for application deployment |
| MongoDB Atlas | - | Cloud database service for MongoDB |
| Redis Cloud | - | Managed Redis service |
| Cloudinary | - | Cloud-based image and video management |
| Sentry | - | Error tracking and monitoring |

### Monitoring and Logging

| Technology | Version | Purpose |
|------------|---------|----------|
| Prometheus | 2.x | Monitoring system and time series database |
| Grafana | 10.x | Analytics and monitoring platform |
| ELK Stack | - | Elasticsearch, Logstash, and Kibana for logging |
| Morgan | 1.x | HTTP request logger middleware |

## Development Tools

### Code Editors and IDEs

| Technology | Version | Purpose |
|------------|---------|----------|
| Visual Studio Code | Latest | Primary code editor |
| WebStorm | Latest | Alternative IDE for JavaScript development |

### Version Control

| Technology | Version | Purpose |
|------------|---------|----------|
| Git | Latest | Version control system |
| GitHub | - | Code hosting platform |

### Project Management

| Technology | Version | Purpose |
|------------|---------|----------|
| Turborepo | 2.x | Monorepo management tool |
| npm | 10.x | Package manager |
| Conventional Commits | - | Commit message convention |
| Semantic Versioning | - | Versioning convention |

## External Integrations

### Maps and Geolocation

| Technology | Version | Purpose |
|------------|---------|----------|
| Google Maps API | - | Maps, geocoding, and route optimization |
| Mapbox | - | Alternative mapping platform |

### Payment Processing

| Technology | Version | Purpose |
|------------|---------|----------|
| Midtrans | - | Payment gateway for Indonesian market |
| Xendit | - | Alternative payment gateway |

### Notifications

| Technology | Version | Purpose |
|------------|---------|----------|
| Twilio | - | SMS and WhatsApp notifications |
| SendGrid | - | Email service provider |
| Firebase Cloud Messaging | - | Push notifications for mobile apps |

## Hardware Requirements

### Development Environment

- **Minimum**: 8GB RAM, 4-core CPU, 256GB SSD
- **Recommended**: 16GB RAM, 8-core CPU, 512GB SSD

### Production Environment

#### Application Servers

- 4 Application Servers (32GB RAM, 16-core CPU, 500GB SSD)
- 2 Database Servers in Cluster (64GB RAM, 32-core CPU, 4TB SSD with RAID)
- 2 Cache Servers (32GB RAM, 16-core CPU, 500GB SSD)
- 2 Storage Servers (8TB SSD with RAID)
- 1 Backup Server (64TB storage with tape backup)
- Load Balancer
- Firewall and Security Appliances

#### Branch Hardware

- Thermal Printers (1 per branch)
- Barcode Scanners (2 per branch)
- Digital Scales (1 per branch)
- Mobile Devices for field staff (2-5 per branch)
- PCs/Laptops for administrative staff (3-5 per branch)
- GPS Trackers for vehicles (1 per vehicle)

## Software Architecture

### Monorepo Structure with Turborepo

```
/
├── apps/
│   ├── web/                 # Next.js web application
│   ├── mobile/              # React Native mobile application
│   ├── api-gateway/         # API Gateway service
│   ├── auth-service/        # Authentication service
│   ├── core-service/        # Core service
│   ├── operations-service/  # Operations service
│   ├── finance-service/     # Finance service
│   ├── notification-service/# Notification service
│   └── reporting-service/   # Reporting service
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── config/              # Shared configuration
│   ├── tsconfig/            # TypeScript configuration
│   ├── eslint-config/       # ESLint configuration
│   └── utils/               # Shared utilities
├── docs/                    # Documentation
└── package.json            # Root package.json
```

## Conclusion

This tech stack document provides a comprehensive overview of the technologies used in the Samudra Paket ERP system. It serves as a reference for developers to understand the technical foundation of the project and ensure consistency in implementation across all components.