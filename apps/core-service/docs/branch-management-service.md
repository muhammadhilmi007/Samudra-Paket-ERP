# Branch Management Service Documentation

## Overview

The Branch Management Service is a core component of the Samudra Paket ERP system, responsible for managing branch offices across the organization. It provides functionality for creating, updating, retrieving, and deleting branches, as well as managing branch hierarchies, status, metrics, resources, operational hours, and documents.

## Architecture

The Branch Management Service follows the hexagonal architecture pattern with clear separation between:

- **API Layer**: Controllers, routes, validators, and middlewares
- **Application Layer**: Use cases and business logic
- **Domain Layer**: Models and entities
- **Infrastructure Layer**: Repositories and external services

### Directory Structure

```
/src
  /api                           # API Layer
    /controllers
      branchController.js        # HTTP request handlers
    /routes
      branchRoutes.js            # API endpoint definitions
    /validators
      branchValidator.js         # Request validation
    /middlewares
      authMiddleware.js          # Authentication middleware
    /postman
      branch-management.postman_collection.json  # Postman collection
  /application                   # Application Layer
    /use-cases
      /branch
        createBranch.js          # Create branch use case
        updateBranch.js          # Update branch use case
        getBranch.js             # Get branch use case
        listBranches.js          # List branches use case
        deleteBranch.js          # Delete branch use case
        getBranchHierarchy.js    # Get branch hierarchy use case
        updateBranchStatus.js    # Update branch status use case
        updateBranchMetrics.js   # Update branch metrics use case
        updateBranchResources.js # Update branch resources use case
        manageBranchDocuments.js # Manage branch documents use case
        updateBranchOperationalHours.js # Update branch operational hours use case
        index.js                 # Export all use cases
  /domain                        # Domain Layer
    /models
      Branch.js                  # Branch model definition
      index.js                   # Export all models
  /infrastructure                # Infrastructure Layer
    /repositories
      branchRepository.js        # Branch data access
      index.js                   # Export all repositories
  /config                        # Configuration
    database.js                  # Database connection
    seeder.js                    # Data seeder
  /utils                         # Utilities
    logger.js                    # Logging utility
    errors.js                    # Error handling utility
    index.js                     # Export all utilities
/tests
  /unit                          # Unit tests
    /application
      /use-cases
        /branch                  # Branch use case tests
    /infrastructure
      /repositories              # Repository tests
    /utils                       # Utility tests
  /integration                   # Integration tests
    /api
      /routes                    # API endpoint tests
```

## Branch Model

The Branch model represents a branch office in the organization and includes the following properties:

### Basic Information
- `code`: Unique branch code (e.g., "JKT-001")
- `name`: Branch name (e.g., "Jakarta Pusat")
- `type`: Branch type (HUB, BRANCH, AGENT, COUNTER)
- `description`: Optional branch description

### Hierarchy Information
- `parentId`: Reference to parent branch (for branch hierarchy)
- `level`: Branch level in the hierarchy

### Status Information
- `status`: Branch status (ACTIVE, INACTIVE, MAINTENANCE)
- `statusReason`: Reason for current status
- `statusUpdatedAt`: When status was last updated
- `statusUpdatedBy`: Who updated the status

### Contact Information
- `address`: Branch address (street, city, province, postalCode, country)
- `coordinates`: Geographic coordinates (latitude, longitude)
- `contact`: Contact information (phoneNumber, email, fax, contactPerson)

### Operational Information
- `operationalHours`: Operating hours for each day of the week

### Resource Information
- `resources`: Resource allocation (vehicles, staff, storageCapacity)

### Performance Metrics
- `metrics`: Performance metrics (dailyShipments, monthlyRevenue, customerSatisfaction, onTimeDeliveryRate)

### Document Management
- `documents`: Array of branch documents (type, name, fileUrl, expiryDate)

### Metadata
- `createdAt`: Creation timestamp
- `createdBy`: User who created the branch
- `updatedAt`: Last update timestamp
- `updatedBy`: User who last updated the branch

## API Endpoints

The Branch Management Service exposes the following RESTful API endpoints:

### Create Branch
- **URL**: `/api/branches`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions Required**: `branch:create`
- **Request Body**:
  ```json
  {
    "code": "JKT-001",
    "name": "Jakarta Pusat",
    "type": "HUB",
    "parentId": null,
    "status": "ACTIVE",
    "address": {
      "street": "Jl. Kebon Sirih No. 10",
      "city": "Jakarta Pusat",
      "province": "DKI Jakarta",
      "postalCode": "10110",
      "country": "Indonesia",
      "coordinates": {
        "latitude": -6.186486,
        "longitude": 106.834091
      }
    },
    "contact": {
      "phoneNumber": "+62215678901",
      "email": "jakarta.pusat@samudrapaket.com",
      "contactPerson": "Budi Santoso"
    },
    "operationalHours": {
      "monday": { "open": "08:00", "close": "17:00" },
      "tuesday": { "open": "08:00", "close": "17:00" },
      "wednesday": { "open": "08:00", "close": "17:00" },
      "thursday": { "open": "08:00", "close": "17:00" },
      "friday": { "open": "08:00", "close": "17:00" },
      "saturday": { "open": "09:00", "close": "15:00" },
      "sunday": { "open": null, "close": null }
    },
    "resources": {
      "vehicles": 5,
      "staff": 15,
      "storageCapacity": 1000
    }
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Branch created successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-001",
      "name": "Jakarta Pusat",
      ...
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation error
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### Get Branch by ID
- **URL**: `/api/branches/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions Required**: `branch:read`
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-001",
      "name": "Jakarta Pusat",
      ...
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Branch not found
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### Update Branch
- **URL**: `/api/branches/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Permissions Required**: `branch:update`
- **Request Body**: (Fields to update)
  ```json
  {
    "name": "Jakarta Pusat Updated",
    "contact": {
      "phoneNumber": "+62215678903",
      "email": "jakarta.pusat.updated@samudrapaket.com"
    }
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Branch updated successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-001",
      "name": "Jakarta Pusat Updated",
      ...
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Branch not found
  - `400 Bad Request`: Validation error
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### Delete Branch
- **URL**: `/api/branches/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Permissions Required**: `branch:delete`
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Branch deleted successfully"
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Branch not found
  - `400 Bad Request`: Cannot delete branch with child branches
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### List Branches
- **URL**: `/api/branches`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions Required**: `branch:read`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `type`: Filter by branch type
  - `status`: Filter by branch status
  - `parentId`: Filter by parent branch
  - `search`: Search by name or code
  - `sortBy`: Field to sort by (default: createdAt)
  - `sortOrder`: Sort order (asc/desc, default: desc)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "branches": [
        {
          "_id": "60d21b4667d0d8992e610c85",
          "code": "JKT-001",
          "name": "Jakarta Pusat",
          ...
        },
        ...
      ],
      "pagination": {
        "total": 15,
        "page": 1,
        "limit": 10,
        "totalPages": 2
      }
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### Get Branch Hierarchy
- **URL**: `/api/branches/hierarchy/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions Required**: `branch:read`
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-001",
      "name": "Jakarta Pusat",
      "children": [
        {
          "_id": "60d21b4667d0d8992e610c86",
          "code": "JKT-002",
          "name": "Jakarta Selatan",
          "children": [
            {
              "_id": "60d21b4667d0d8992e610c87",
              "code": "JKT-003",
              "name": "Kebayoran Baru",
              "children": []
            }
          ]
        }
      ]
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Branch not found
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### Update Branch Status
- **URL**: `/api/branches/:id/status`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Permissions Required**: `branch:update`
- **Request Body**:
  ```json
  {
    "status": "INACTIVE",
    "statusReason": "Temporary closure for renovation"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Branch status updated successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-001",
      "name": "Jakarta Pusat",
      "status": "INACTIVE",
      "statusReason": "Temporary closure for renovation",
      ...
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Branch not found
  - `400 Bad Request`: Validation error
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### Update Branch Metrics
- **URL**: `/api/branches/:id/metrics`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Permissions Required**: `branch:update`
- **Request Body**:
  ```json
  {
    "metrics": {
      "dailyShipments": 120,
      "monthlyRevenue": 75000000,
      "customerSatisfaction": 4.8,
      "onTimeDeliveryRate": 0.95
    }
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Branch metrics updated successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-001",
      "name": "Jakarta Pusat",
      "metrics": {
        "dailyShipments": 120,
        "monthlyRevenue": 75000000,
        "customerSatisfaction": 4.8,
        "onTimeDeliveryRate": 0.95
      },
      ...
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Branch not found
  - `400 Bad Request`: Validation error
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### Update Branch Resources
- **URL**: `/api/branches/:id/resources`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Permissions Required**: `branch:update`
- **Request Body**:
  ```json
  {
    "resources": {
      "vehicles": 7,
      "staff": 18,
      "storageCapacity": 1200
    }
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Branch resources updated successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-001",
      "name": "Jakarta Pusat",
      "resources": {
        "vehicles": 7,
        "staff": 18,
        "storageCapacity": 1200
      },
      ...
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Branch not found
  - `400 Bad Request`: Validation error
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### Add Branch Document
- **URL**: `/api/branches/:id/documents`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions Required**: `branch:update`
- **Request Body**:
  ```json
  {
    "document": {
      "type": "LICENSE",
      "name": "Business License",
      "fileUrl": "https://storage.samudrapaket.com/documents/license-jkt001.pdf",
      "expiryDate": "2025-12-31"
    }
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Document added successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-001",
      "name": "Jakarta Pusat",
      "documents": [
        {
          "_id": "60d21b4667d0d8992e610c90",
          "type": "LICENSE",
          "name": "Business License",
          "fileUrl": "https://storage.samudrapaket.com/documents/license-jkt001.pdf",
          "expiryDate": "2025-12-31",
          "uploadedAt": "2023-01-15T08:30:00.000Z",
          "uploadedBy": "user123"
        }
      ],
      ...
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Branch not found
  - `400 Bad Request`: Validation error
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### Remove Branch Document
- **URL**: `/api/branches/:id/documents/:documentId`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Permissions Required**: `branch:update`
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Document removed successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-001",
      "name": "Jakarta Pusat",
      "documents": [],
      ...
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Branch or document not found
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

### Update Branch Operational Hours
- **URL**: `/api/branches/:id/operational-hours`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Permissions Required**: `branch:update`
- **Request Body**:
  ```json
  {
    "operationalHours": {
      "monday": { "open": "07:30", "close": "18:00" },
      "tuesday": { "open": "07:30", "close": "18:00" },
      "wednesday": { "open": "07:30", "close": "18:00" },
      "thursday": { "open": "07:30", "close": "18:00" },
      "friday": { "open": "07:30", "close": "18:00" },
      "saturday": { "open": "08:00", "close": "16:00" },
      "sunday": { "open": "10:00", "close": "14:00" }
    }
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Operational hours updated successfully",
    "data": {
      "_id": "60d21b4667d0d8992e610c85",
      "code": "JKT-001",
      "name": "Jakarta Pusat",
      "operationalHours": {
        "monday": { "open": "07:30", "close": "18:00" },
        "tuesday": { "open": "07:30", "close": "18:00" },
        "wednesday": { "open": "07:30", "close": "18:00" },
        "thursday": { "open": "07:30", "close": "18:00" },
        "friday": { "open": "07:30", "close": "18:00" },
        "saturday": { "open": "08:00", "close": "16:00" },
        "sunday": { "open": "10:00", "close": "14:00" }
      },
      ...
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Branch not found
  - `400 Bad Request`: Validation error
  - `401 Unauthorized`: Authentication required
  - `403 Forbidden`: Insufficient permissions

## Testing

The Branch Management Service includes comprehensive tests to ensure all functionality works as expected:

### Unit Tests
- **Branch Model**: Tests for model validation and methods
- **Branch Repository**: Tests for data access methods
- **Branch Use Cases**: Tests for business logic
- **Utilities**: Tests for error handling and logging

### Integration Tests
- **API Endpoints**: End-to-end tests for all API endpoints
- **Authentication**: Tests for authentication and authorization
- **Validation**: Tests for request validation

### Running Tests

To run the tests, use the following commands:

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage report
npm run test:coverage

# Run specific test suite
node test-branch-management.js --unit --branch-model
```

## Error Handling

The Branch Management Service uses standardized error handling with custom error classes:

- **ValidationError**: For validation failures (400 Bad Request)
- **NotFoundError**: For resource not found (404 Not Found)
- **UnauthorizedError**: For authentication failures (401 Unauthorized)
- **ForbiddenError**: For authorization failures (403 Forbidden)
- **ConflictError**: For resource conflicts (409 Conflict)
- **ApplicationError**: Base class for application errors (500 Internal Server Error)

Error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error information"]
}
```

## Validation

Request validation is implemented using Joi with the following rules:

### Branch Creation Validation
- `code`: Required, unique, string, matches pattern
- `name`: Required, string, min 3 chars, max 100 chars
- `type`: Required, enum (HUB, BRANCH, AGENT, COUNTER)
- `parentId`: Optional, valid ObjectId
- `status`: Required, enum (ACTIVE, INACTIVE, MAINTENANCE)
- `address`: Required object with nested validation
- `contact`: Required object with nested validation
- `operationalHours`: Optional object with nested validation
- `resources`: Optional object with nested validation

### Branch Update Validation
- Similar to creation validation but all fields are optional

### Status Update Validation
- `status`: Required, enum (ACTIVE, INACTIVE, MAINTENANCE)
- `statusReason`: Required if status is INACTIVE or MAINTENANCE

### Metrics Update Validation
- `metrics`: Required object with nested validation
- `metrics.dailyShipments`: Number, min 0
- `metrics.monthlyRevenue`: Number, min 0
- `metrics.customerSatisfaction`: Number, min 0, max 5
- `metrics.onTimeDeliveryRate`: Number, min 0, max 1

### Resources Update Validation
- `resources`: Required object with nested validation
- `resources.vehicles`: Number, min 0
- `resources.staff`: Number, min 0
- `resources.storageCapacity`: Number, min 0

### Document Validation
- `document`: Required object with nested validation
- `document.type`: Required, enum (LICENSE, PERMIT, CERTIFICATE, CONTRACT, OTHER)
- `document.name`: Required, string
- `document.fileUrl`: Required, valid URL
- `document.expiryDate`: Optional, valid date

### Operational Hours Validation
- `operationalHours`: Required object with nested validation
- Each day: Object with open and close times (both null or both valid time strings)

## Conclusion

The Branch Management Service provides a comprehensive solution for managing branch offices in the Samudra Paket ERP system. It follows best practices for architecture, testing, error handling, and validation, ensuring a robust and maintainable codebase.

For any questions or issues, please contact the development team.
