# Samudra Paket ERP - Web Frontend

This is the web frontend for the Samudra Paket ERP system, built for PT. Sarana Mudah Raya. It provides a comprehensive user interface for managing logistics and shipping operations.

## Technology Stack

- **Framework**: Next.js (App Router)
- **UI Library**: React
- **Styling**: Tailwind CSS with Shadcn UI
- **State Management**: Redux Toolkit + React Query
- **Form Handling**: React Hook Form + Zod
- **Authentication**: JWT-based with refresh tokens
- **API Integration**: Centralized API client with service modules
- **Real-time Updates**: WebSocket integration

## Project Structure

The project follows the Atomic Design methodology for organizing components:

```
/src
  /app                   # Next.js App Router pages
  /components            # React components
    /atoms               # Basic UI elements (Button, Input, etc.)
    /molecules           # Simple component groups (FormField, Card, etc.)
    /organisms           # Complex components (Header, Sidebar, etc.)
    /templates           # Page layouts (DashboardLayout, AuthLayout, etc.)
    /pages               # Page components (LoginPage, DashboardPage, etc.)
    /hoc                 # Higher-order components (withAuth, etc.)
  /hooks                 # Custom React hooks
    /useApi.js           # Hook for handling API requests
    /useAuthService.js   # Hook for auth service operations
    /useCoreService.js   # Hook for core service operations
    /useWebSocket.js     # Hook for WebSocket connections
  /middleware            # Next.js middleware for route protection
  /providers             # Context providers
  /services              # Service modules for API integration
    /authService.js      # Authentication service
    /coreService.js      # Core business operations service
  /store                 # Redux store
    /slices              # Redux slices
    /api                 # API endpoints (RTK Query)
    /thunks              # Async action creators
  /utils                 # Utility functions
    /apiClient.js        # Centralized API client
    /apiConfig.js        # API configuration
    /tokenManager.js     # Token management utilities
  /styles                # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository
2. Navigate to the web app directory:
   ```bash
   cd apps/web
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the application for production:

```bash
npm run build
```

To run the production build:

```bash
npm start
```

## Features

- **Authentication**: User login, registration, and password reset
- **Dashboard**: Overview of key metrics and recent activities
- **Shipment Management**: Create, track, and manage shipments
- **Customer Management**: Manage customer information and shipping history
- **Financial Management**: Handle invoices, payments, and financial reports
- **Responsive Design**: Mobile-first approach for all devices
- **Theme Support**: Light and dark mode support
- **Offline Capabilities**: Progressive Web App features for offline access

## Code Guidelines

### Component Structure

- Each component should have a clear, single responsibility
- Use TypeScript for type safety
- Include JSDoc comments for all components and functions
- Follow the naming conventions:
  - Components: PascalCase (e.g., `Button.jsx`)
  - Hooks: camelCase with 'use' prefix (e.g., `useAuth.js`)
  - Utilities: camelCase (e.g., `formatDate.js`)

### Styling

- Use Tailwind CSS for styling
- Follow the defined color palette:
  - Primary: #2563EB
  - Secondary: #10B981
  - Success: #22C55E
  - Warning: #F59E0B
  - Error: #EF4444

### State Management

- Use Redux Toolkit for global state
- Use React Query for server state
- Use local state (useState/useReducer) for component-specific state

### Form Handling

- Use React Hook Form for form state management
- Use Zod for form validation
- Create reusable form components

## Service Integration

The web application integrates with multiple backend microservices through a centralized API client:

### API Client

The `apiClient.js` utility provides a centralized client for making API requests to the backend services. It includes:

- Request and response interceptors
- Authentication token management
- Error handling
- Performance tracking
- Automatic token refresh

### Service Modules

Service modules provide domain-specific methods for interacting with backend services:

- **Auth Service**: Handles authentication operations (login, registration, token refresh)
- **Core Service**: Handles core business operations (shipments, customers, pickups, deliveries)

### Custom Hooks

Custom hooks make it easy to use services in React components:

- **useApi**: Generic hook for making API requests with loading and error states
- **useAuthService**: Hook for authentication operations
- **useCoreService**: Hook for core business operations

### Token Management

The `tokenManager.js` utility handles secure storage and retrieval of authentication tokens:

- Stores tokens in both cookies (for server-side authentication) and localStorage (for persistence)
- Provides methods for token validation and expiration checking
- Handles token refresh logic

### Route Protection

The Next.js middleware (`middleware.js`) protects routes that require authentication:

- Redirects unauthenticated users to the login page
- Returns 401 responses for unauthorized API requests
- Allows access to public routes without authentication

### Real-time Updates

The application uses WebSockets for real-time updates:

- The `WebSocketProvider` component initializes the WebSocket connection
- The `useWebSocket` hook provides an interface for subscribing to and sending messages
- The `RealTimeNotifications` component displays notifications received through WebSockets

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_AUTH_COOKIE_NAME=token
NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME=refreshToken

# WebSocket
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001
```

## API Integration

The web frontend communicates with the backend services through the API Gateway. The base URL for API requests is configured in the environment variables.

### Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3003/api
```

## Deployment

The application is deployed to Railway.com. The deployment process is automated through GitHub Actions.

## Contributing

1. Follow the code guidelines
2. Write tests for new features
3. Update documentation as needed
4. Submit a pull request

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
