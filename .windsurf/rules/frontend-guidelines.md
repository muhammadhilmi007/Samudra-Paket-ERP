---
trigger: always_on
---

# Frontend Guidelines

## Coding Standards

1. Use JavaScript ES2022 features and functional components with hooks
2. Keep components small with single responsibility
3. Use meaningful variable/function names and JSDoc comments
4. Implement proper error handling for async operations
5. Use destructuring, PropTypes, and optional chaining
6. Follow Airbnb JavaScript Style Guide
7. Avoid inline styles; use Tailwind utility classes

## Styling Guidelines

1. Use Tailwind CSS with defined color palette:
   - Primary: #2563EB, Secondary: #10B981, Neutral: Gray scale
   - Success: #22C55E, Warning: #F59E0B, Error: #EF4444

2. Follow mobile-first approach with breakpoints:
   - Mobile: < 640px, Tablet: 640px-1023px, Desktop: 1024px+

3. Use Tailwind's spacing scale (base: 0.25rem) and typography system

4. Use Shadcn UI components as foundation

## State Management

1. Local state: useState/useReducer
2. Global state: Redux Toolkit with normalized store
3. Server state: React Query with proper caching
4. Use context API for theme, auth, and cross-cutting concerns
5. Implement loading, error, and success states for data fetching

## Form Handling

1. Use React Hook Form with Zod validation schemas
2. Create reusable form components with proper error messages
3. Implement controlled components and loading states
4. Validate data on both client and server sides

## Performance Optimization

1. Use React.memo, useMemo, and useCallback appropriately
2. Implement code splitting with dynamic imports
3. Use Next.js Image component for optimized images
4. Implement list virtualization for long lists
5. Optimize bundle size and minimize re-renders

## Accessibility (WCAG 2.1 AA)

1. Use semantic HTML and proper keyboard navigation
2. Ensure sufficient color contrast (4.5:1 minimum)
3. Provide text alternatives and proper focus management
4. Use ARIA attributes when necessary
5. Ensure form elements have associated labels

## Testing

1. Write unit tests with Jest and React Testing Library
2. Test behavior, not implementation details
3. Maintain minimum 80% code coverage
4. Test error states and critical user flows
5. Implement E2E tests with Cypress for critical paths

## Error Handling

1. Implement error boundaries with fallback UI
2. Use consistent API error handling with clear messages
3. Log errors to monitoring service
4. Handle offline scenarios gracefully
5. Test error scenarios thoroughly

## Internationalization

1. Use next-i18next with Indonesian (id) and English (en)
2. Extract all user-facing strings to translation files
3. Format dates, numbers, and currencies by locale
4. Test UI with different language string lengths

## Mobile Responsiveness

1. Design mobile-first, then enhance for larger screens
2. Optimize touch targets (minimum 44x44px)
3. Consider network conditions and performance
4. Test on various device sizes and actual devices