---
trigger: always_on
---

# Frontend Structure Rules

## Atomic Design Structure

1. Use Atomic Design methodology with hierarchy: Atoms (buttons, inputs) → Molecules (form fields) → Organisms (navigation bars) → Templates (layouts) → Pages (instances with content)

2. Folder structure:
   ```
   /components
     /atoms          # Basic UI elements
     /molecules      # Simple component groups
     /organisms      # Complex components
     /templates      # Page layouts
     /pages          # Page implementations
   ```

## Project Structure

1. Main folder structure:
   ```
   /src
     /components      # Atomic design components
     /hooks           # Custom React hooks
     /pages           # Next.js pages
     /services        # API service functions
     /store           # Redux store configuration
     /styles          # Global styles and Tailwind
     /contexts        # React contexts
     /utils           # Utility functions
     /assets          # Static assets
   ```

2. Component folders must include:
   - Component file (ComponentName.jsx)
   - Test file (ComponentName.test.jsx)

## Naming Conventions

1. **Directories**: kebab-case (form-components)
2. **Files**: camelCase for utilities (apiService.js)
3. **Components**: PascalCase (ShipmentCard.jsx)
4. **Hooks**: prefix with use (useShipmentData.js)
5. **Context**: suffix with Context (AuthContext.js)
6. **Redux**: suffix with Slice (shipmentSlice.js)
7. **Constants**: UPPER_SNAKE_CASE

## State Management

1. Redux Toolkit structure:
   ```
   /store
     /slices         # Feature slices
     index.js        # Store configuration
     hooks.js        # Custom Redux hooks
   ```

2. React Query for server state:
   ```javascript
   export const useShipments = (params) => {
     return useQuery(['shipments', params], 
       () => shipmentService.getShipments(params));
   };
   ```

## API Services

1. Organize by domain with consistent patterns:
   ```javascript
   export const shipmentService = {
     getShipments: (params) => apiClient.get('/shipments', { params }),
     getShipmentById: (id) => apiClient.get(`/shipments/${id}`),
     createShipment: (data) => apiClient.post('/shipments', data),
   };
   ```

## Routing

1. Use Next.js App Router with organized structure:
   ```
   /app
     /dashboard       # Dashboard section
     /shipments       # Shipment management
     /auth            # Authentication pages
   ```

## Forms

1. Use React Hook Form with Zod validation

## Internationalization

1. Use next-i18next with locales for Indonesian (id) and English (en)

## Testing

1. Organize tests alongside components
2. Use Jest and React Testing Library

## Documentation

1. Use JSDoc for component documentation
2. Implement Storybook for component library