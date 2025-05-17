# Samudra Paket ERP - Core Service

This service is part of the Samudra Paket ERP system, responsible for managing core business entities including branches, regions, services, and other essential business data.

## Features

### Branch Management
- Create, read, update, and delete branches
- Manage branch hierarchy (parent-child relationships)
- Update branch status, metrics, resources, and operational hours
- Manage branch documents
- List branches with filtering, sorting, and pagination

## Architecture

This service follows the hexagonal architecture pattern with the following layers:
- **API Layer**: Controllers, routes, validators, and middlewares
- **Application Layer**: Use cases and business logic
- **Domain Layer**: Models and entities
- **Infrastructure Layer**: Repositories and external services

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication
- **Jest**: Testing framework
- **Swagger**: API documentation

## API Documentation

API documentation is available via Swagger UI at `/api-docs` when the service is running.

### Branch Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/branches | Create a new branch |
| GET | /api/branches/:id | Get a branch by ID |
| PUT | /api/branches/:id | Update a branch |
| DELETE | /api/branches/:id | Delete a branch |
| GET | /api/branches | List branches with pagination and filtering |
| GET | /api/branches/hierarchy/:id | Get branch hierarchy |
| PATCH | /api/branches/:id/status | Update branch status |
| PATCH | /api/branches/:id/metrics | Update branch metrics |
| PATCH | /api/branches/:id/resources | Update branch resources |
| POST | /api/branches/:id/documents | Add a document to a branch |
| DELETE | /api/branches/:id/documents/:documentId | Remove a document from a branch |
| PATCH | /api/branches/:id/operational-hours | Update branch operational hours |

## Getting Started

### Prerequisites

- Node.js (v22 LTS)
- MongoDB
- npm

### Installation

1. Clone the repository
2. Navigate to the core-service directory:
   ```
   cd apps/core-service
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Copy the `.env.example` file to `.env` and update the values:
   ```
   cp .env.example .env
   ```
5. Start the service:
   ```
   npm start
   ```

For development with auto-reload:
```
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port to run the service on | 3001 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/samudra-core |
| JWT_SECRET | Secret key for JWT | - |
| NODE_ENV | Environment (development, test, production) | development |
| LOG_LEVEL | Logging level | info |

## Testing

### Running Tests

Run all tests:
```
npm test
```

Run tests with coverage:
```
npm run test:coverage
```

Run only unit tests:
```
npm run test:unit
```

Run only integration tests:
```
npm run test:integration
```

### Test Structure

- **Unit Tests**: Test individual components in isolation
  - Use cases
  - Repositories
  - Validators

- **Integration Tests**: Test API endpoints and database interactions
  - API routes
  - End-to-end flows

## Postman Collection

A Postman collection is available in the `src/api/postman` directory for testing the API endpoints.

## Project Structure

```
/src
  /api              # API Layer
    /controllers    # Request handlers
    /routes         # Route definitions
    /middlewares    # API middlewares
    /validators     # Request validation
    /postman        # Postman collections
  /application      # Application Layer
    /use-cases      # Business logic use cases
    /services       # Service implementations
    /dtos           # Data transfer objects
  /domain           # Domain Layer
    /models         # Domain models/entities
    /events         # Domain events
    /value-objects  # Value objects
  /infrastructure   # Infrastructure Layer
    /repositories   # Data access implementations
    /database       # Database connection
    /external       # External service clients
  /config           # Configuration
  /utils            # Utilities and helpers
/tests
  /unit             # Unit tests
  /integration      # Integration tests
```

## Contributing

1. Follow the project's coding standards and architecture
2. Write tests for new features
3. Update documentation as needed
4. Submit pull requests for review

## License

Proprietary - PT. Sarana Mudah Raya
