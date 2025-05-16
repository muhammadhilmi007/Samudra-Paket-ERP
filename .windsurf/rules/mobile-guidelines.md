---
trigger: always_on
---

# Mobile Guidelines

## Coding Standards

1. Use TypeScript for all mobile development with strict type checking
2. Follow Airbnb TypeScript Style Guide for code formatting and style
3. Use functional components with hooks instead of class components
4. Implement proper error handling for all asynchronous operations
5. Keep components small and focused on a single responsibility
6. Document all components, functions, and complex logic with JSDoc comments
7. Use optional chaining and nullish coalescing operators for safer property access
8. Implement proper prop validation with PropTypes or TypeScript interfaces

## Offline-First Development

1. Design all features to work offline by default
2. Implement data synchronization with conflict resolution strategy
3. Queue operations when offline for later synchronization
4. Prioritize critical operations when connectivity returns
5. Provide clear offline indicators and sync status to users
6. Implement proper error handling for sync failures
7. Use WatermelonDB for local data storage and synchronization
8. Implement data migration strategies for schema changes

## Performance Optimization

1. Optimize battery usage for field operations
2. Minimize network requests and implement proper caching
3. Use memoization for expensive calculations
4. Implement virtualized lists for long scrolling lists
5. Optimize image handling with proper resizing and compression
6. Use lazy loading for non-critical components
7. Implement proper memory management for large datasets
8. Monitor and optimize app startup time

## Device Integration

1. Implement proper camera integration for document scanning and photos
2. Use GPS and location services efficiently to minimize battery drain
3. Implement signature capture with proper validation
4. Support barcode scanning for package tracking
5. Implement Bluetooth printing for receipt generation
6. Handle device permissions properly with clear user messaging
7. Support different screen sizes and orientations
8. Implement proper file storage for offline documents

## User Experience

1. Design for one-handed operation where possible
2. Implement clear loading states and progress indicators
3. Provide haptic feedback for important actions
4. Design for outdoor visibility with high contrast
5. Implement proper error messages with recovery options
6. Use consistent navigation patterns across the app
7. Minimize text input with barcode scanning and selection lists
8. Implement proper form validation with clear error messages

## Security

1. Implement secure storage for authentication tokens
2. Encrypt sensitive data stored on the device
3. Implement proper session management with auto-logout
4. Use secure communication with HTTPS and certificate pinning
5. Implement proper authentication for offline operations
6. Handle device sharing scenarios securely
7. Implement proper access control based on user roles
8. Secure local data with proper encryption

## Role-Based Features

1. Courier App Features:
   - Pickup task management
   - Navigation to pickup locations
   - Package documentation with photos
   - Digital signature capture
   - STT generation
   - Offline operation support

2. Driver App Features:
   - Delivery task management
   - Route optimization
   - Navigation to delivery addresses
   - Proof of delivery capture
   - COD collection
   - Receipt generation

3. Collector App Features:
   - Collection task management
   - Payment processing
   - Receipt generation
   - Customer management
   - Collection reporting

4. Warehouse App Features:
   - Package receiving
   - Sorting management
   - Loading management
   - Inventory tracking
   - Manifest generation

5. Manager App Features:
   - Performance tracking
   - Task assignment
   - Issue resolution
   - Reporting and analytics
   - Team management

## Testing

1. Implement unit tests for all business logic
2. Create component tests for UI elements
3. Implement integration tests for critical flows
4. Test offline functionality thoroughly
5. Test on various device sizes and OS versions
6. Implement proper mocking for external dependencies
7. Test synchronization with poor network conditions
8. Implement end-to-end tests for critical user journeys

## Accessibility

1. Support system font size adjustments
2. Implement proper contrast for outdoor visibility
3. Ensure touch targets are at least 44x44 points
4. Support screen readers for critical information
5. Implement proper focus management for keyboard navigation
6. Provide text alternatives for non-text content
7. Design for colorblind users with proper color combinations
8. Test with accessibility tools

## Error Handling

1. Implement proper error boundaries to prevent app crashes
2. Provide clear error messages with recovery options
3. Log errors for later analysis and debugging
4. Handle network errors gracefully with retry options
5. Implement proper validation to prevent errors
6. Handle device-specific errors properly
7. Provide fallback options for critical features
8. Implement proper error reporting to monitoring services