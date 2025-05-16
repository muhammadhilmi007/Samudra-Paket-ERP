# Coding Standards for Samudra Paket ERP

## Overview

This document defines the coding standards and style guidelines for the Samudra Paket ERP project. Following these standards ensures code consistency, readability, and maintainability across the codebase.

## General Principles

1. **Readability**: Code should be easy to read and understand
2. **Simplicity**: Prefer simple solutions over complex ones
3. **Consistency**: Follow established patterns and conventions
4. **Documentation**: Document code appropriately with comments and JSDoc
5. **Testing**: Write tests for all business logic

## File Structure and Naming

### Directory Structure

Follow the monorepo structure with Turborepo as defined in the File Structure Document:

```
/samudra-erp                     # Root directory
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
└── docs/                        # Project documentation
```

### Naming Conventions

1. **Directories**: Use kebab-case (e.g., `user-management`)
2. **Files**:
   - Use camelCase for utility files (e.g., `apiService.js`)
   - Use PascalCase for component files (e.g., `Button.jsx`)
   - Use kebab-case for configuration files (e.g., `eslint-config.js`)
3. **Components**:
   - Use PascalCase for component names (e.g., `UserProfile`)
   - Prefix higher-order components with `with` (e.g., `withAuth`)
   - Prefix custom hooks with `use` (e.g., `useAuth`)
4. **Variables/Functions**: Use camelCase (e.g., `getUserData`)
5. **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
6. **Classes**: Use PascalCase (e.g., `ShipmentService`)
7. **Interfaces/Types**: Use PascalCase (e.g., `UserProfile`)
8. **API Endpoints**:
   - Use kebab-case for paths (e.g., `/api/pickup-requests`)
   - Use plural nouns for collection endpoints (e.g., `/api/shipments`)

## JavaScript/TypeScript Standards

### Code Style

1. Follow the Airbnb JavaScript Style Guide
2. Use 2 spaces for indentation
3. Use semicolons at the end of statements
4. Use single quotes for strings
5. Add trailing commas for multi-line arrays and objects
6. Keep line length under 100 characters
7. Use parentheses around arrow function parameters, even when there is only one parameter

### Best Practices

1. Use ES2022 features for all JavaScript code
2. Use `const` for variables that are not reassigned, `let` otherwise, avoid `var`
3. Use arrow functions for anonymous functions
4. Use template literals instead of string concatenation
5. Use destructuring for objects and arrays
6. Use spread operator for shallow copying
7. Use optional chaining and nullish coalescing operators
8. Use async/await for asynchronous operations
9. Use early returns to reduce nesting
10. Avoid using `any` type in TypeScript

### Example

```javascript
// Good
const getUserData = async (userId) => {
  try {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data;
  } catch (error) {
    logger.error("Failed to fetch user data", { userId, error });
    throw new Error("Failed to fetch user data");
  }
};

// Bad
var getUserData = function (userId) {
  return apiClient
    .get("/users/" + userId)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log("Error:", error);
      throw error;
    });
};
```

## React/Next.js Standards

### Component Structure

1. Use functional components with hooks
2. Keep components small and focused on a single responsibility
3. Follow Atomic Design methodology:
   - **Atoms**: Basic building blocks (Button, Input, etc.)
   - **Molecules**: Simple component groups (FormField, Card, etc.)
   - **Organisms**: Complex components (Navigation, Form, etc.)
   - **Templates**: Page layouts
   - **Pages**: Complete pages with content

### Props and State

1. Use PropTypes or TypeScript interfaces for prop validation
2. Destructure props in function parameters
3. Use default props where appropriate
4. Keep state minimal and focused
5. Use appropriate state management based on complexity:
   - Local state: `useState`/`useReducer`
   - Global state: Redux Toolkit
   - Server state: React Query

### Example

```jsx
// Good
const UserCard = ({ name, email, role, onEdit }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium">{name}</h3>
      <p className="text-gray-600">{email}</p>
      <Badge variant="outline">{role}</Badge>
      <Button onClick={onEdit} variant="outline" size="sm">
        Edit
      </Button>
    </Card>
  );
};

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

// Bad
class UserCard extends React.Component {
  render() {
    return (
      <div style={{ padding: "16px", border: "1px solid #ccc" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 500 }}>{this.props.name}</h3>
        <p style={{ color: "#666" }}>{this.props.email}</p>
        <span>{this.props.role}</span>
        <button onClick={this.props.onEdit}>Edit</button>
      </div>
    );
  }
}
```

## Node.js/Express.js Standards

### API Structure

1. Follow RESTful API design principles
2. Use proper HTTP methods for operations:
   - GET: Retrieve resources
   - POST: Create resources
   - PUT: Update resources (full update)
   - PATCH: Update resources (partial update)
   - DELETE: Remove resources
3. Use proper HTTP status codes
4. Implement consistent request/response format
5. Use middleware for cross-cutting concerns

### Error Handling

1. Use try/catch blocks for async operations
2. Create custom error classes for different error types
3. Return standardized error responses
4. Log errors with appropriate context
5. Don't expose sensitive error information to clients

### Example

```javascript
// Good
router.get("/shipments/:id", async (req, res, next) => {
  try {
    const shipment = await shipmentService.getById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        error: "Shipment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    logger.error("Failed to fetch shipment", { id: req.params.id, error });
    return next(error);
  }
});

// Bad
router.get("/shipments/:id", function (req, res) {
  shipmentService
    .getById(req.params.id)
    .then(function (shipment) {
      if (!shipment) {
        res.status(404).send("Not found");
      } else {
        res.send(shipment);
      }
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("Server error");
    });
});
```

## React Native Standards

### Mobile-Specific Guidelines

1. Design for offline-first operation
2. Optimize for battery life and data usage
3. Use proper error handling for network operations
4. Implement proper loading states
5. Design for different screen sizes
6. Use React Navigation for navigation
7. Use WatermelonDB for offline data storage

### Example

```jsx
// Good
const ShipmentListScreen = () => {
  const { isConnected } = useNetInfo();
  const { data, isLoading, error } = useShipments();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <ErrorView message="Failed to load shipments" onRetry={() => refetch()} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && <OfflineBanner />}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ShipmentCard shipment={item} />}
        ListEmptyComponent={<EmptyState message="No shipments found" />}
      />
    </SafeAreaView>
  );
};

// Bad
class ShipmentListScreen extends React.Component {
  state = {
    shipments: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchShipments();
  }

  fetchShipments() {
    fetch("/api/shipments")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ shipments: data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  render() {
    if (this.state.loading) {
      return <Text>Loading...</Text>;
    }

    if (this.state.error) {
      return <Text>Error: {this.state.error.message}</Text>;
    }

    return (
      <View>
        {this.state.shipments.map((shipment) => (
          <View key={shipment.id}>
            <Text>{shipment.trackingNumber}</Text>
          </View>
        ))}
      </View>
    );
  }
}
```

## Testing Standards

### Unit Testing

1. Use Jest for unit testing
2. Test business logic thoroughly
3. Use React Testing Library for component testing
4. Mock external dependencies
5. Focus on testing behavior, not implementation details
6. Maintain minimum 80% code coverage

### Example

```javascript
// Good
describe("shipmentService.calculatePrice", () => {
  it("should calculate correct price for regular service", () => {
    const shipment = {
      weight: 5,
      dimensions: { length: 30, width: 20, height: 10 },
      service: "regular",
    };

    const price = shipmentService.calculatePrice(shipment);

    expect(price).toBe(50000);
  });

  it("should apply surcharge for express service", () => {
    const shipment = {
      weight: 5,
      dimensions: { length: 30, width: 20, height: 10 },
      service: "express",
    };

    const price = shipmentService.calculatePrice(shipment);

    expect(price).toBe(75000);
  });
});

// Bad
test("calculatePrice works", () => {
  expect(
    shipmentService.calculatePrice({
      weight: 5,
      dimensions: { length: 30, width: 20, height: 10 },
      service: "regular",
    }),
  ).toBe(50000);
});
```

## Documentation Standards

1. Use JSDoc comments for functions, classes, and components
2. Include descriptions, parameter types, return types, and examples
3. Document complex algorithms and business logic
4. Keep documentation up-to-date with code changes
5. Use Swagger/OpenAPI for API documentation

### Example

```javascript
/**
 * Calculates the shipping price based on weight, dimensions, and service type
 *
 * @param {Object} shipment - The shipment details
 * @param {number} shipment.weight - Weight in kilograms
 * @param {Object} shipment.dimensions - Package dimensions
 * @param {number} shipment.dimensions.length - Length in centimeters
 * @param {number} shipment.dimensions.width - Width in centimeters
 * @param {number} shipment.dimensions.height - Height in centimeters
 * @param {string} shipment.service - Service type ('regular', 'express', 'same-day')
 * @returns {number} The calculated price in IDR
 *
 * @example
 * const price = calculatePrice({
 *   weight: 5,
 *   dimensions: { length: 30, width: 20, height: 10 },
 *   service: 'regular'
 * });
 * // Returns: 50000
 */
const calculatePrice = (shipment) => {
  // Implementation
};
```

## Conclusion

These coding standards provide a foundation for consistent, high-quality code across the Samudra Paket ERP project. All team members should adhere to these standards to ensure maintainability and scalability of the codebase.
