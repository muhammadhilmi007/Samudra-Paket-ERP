# Samudra Paket ERP

Enterprise Resource Planning system for PT. Sarana Mudah Raya, a logistics and shipping company.

## Project Overview

Samudra Paket ERP is a comprehensive enterprise resource planning system that integrates all business processes including pickup management, shipment tracking, delivery management, financial operations, and reporting.

## Architecture

The system follows a microservice architecture with API Gateway pattern:

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

## Tech Stack

- **Frontend Web**: Next.js (Version 15) App Router with JavaScript, Tailwind CSS (Version 4), Shadcn UI
- **Frontend Mobile**: React Native (Expo) with TypeScript
- **Backend**: Node.js, Express.js with JavaScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Deployment**: Railway.com
- **CI/CD**: GitHub Actions

## Project Structure

```
/samudra-app                     # Root directory
├── apps/                        # Application packages
│   ├── api-gateway/             # API Gateway service
│   ├── auth-service/            # Authentication service
│   ├── core-service/            # Core service
│   ├── operations-service/      # Operations service
│   ├── finance-service/         # Finance service
│   ├── notification-service/    # Notification service
│   ├── reporting-service/       # Reporting service
│   ├── web/                     # Next.js web application
│   └── mobile/                  # React Native mobile application
├── packages/                    # Shared packages
│   ├── ui/                      # Shared UI components
│   ├── config/                  # Shared configuration
│   ├── utils/                   # Shared utilities
│   ├── api-client/              # API client for frontend
│   ├── logger/                  # Logging utilities
│   ├── validation/              # Validation schemas
│   └── types/                   # Shared TypeScript types
├── docs/                        # Project documentation
├── documentation/               # Technical documentation
├── software-docs/               # Software requirements
└── scripts/                     # Utility scripts
```

## Getting Started

### Prerequisites

- Node.js (Version 22 LTS)
- Yarn (Version 1.22.19 or higher)
- MongoDB (Version 6)
- Redis (Version 7)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-organization/samudra-paket-erp.git
cd samudra-paket-erp
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
yarn dev
```

## Development Workflow

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them using Conventional Commits:
```bash
git commit -m "feat: add new feature"
```

3. Push your branch and create a pull request:
```bash
git push origin feature/your-feature-name
```

## Testing

Run tests for all packages and applications:
```bash
yarn test
```

## Deployment

The project is deployed to Railway.com using GitHub Actions. Pushing to the main branch will trigger a deployment to the production environment, while pushing to the development branch will deploy to the staging environment.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is proprietary and confidential. Unauthorized copying, transfer, or reproduction of the contents of this repository is strictly prohibited.

## Contact

For any inquiries, please contact the project maintainers.
