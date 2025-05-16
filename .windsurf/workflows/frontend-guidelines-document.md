---
description: How to implement frontend development standards for Samudra Paket ERP
---

# Frontend Guidelines Document Workflow

This workflow guides you through understanding and implementing the frontend development standards for the Samudra Paket ERP system, focusing on code quality, UI/UX consistency, and performance optimization.

## Steps to Follow

1. Follow the coding standards:
   - Use JavaScript ES2022 features and functional components with hooks
   - Keep components small with single responsibility
   - Use meaningful variable/function names and JSDoc comments
   - Implement proper error handling for async operations
   - Follow Airbnb JavaScript Style Guide
   - Avoid inline styles; use Tailwind utility classes

2. Implement the styling guidelines:
   - Use Tailwind CSS with defined color palette:
     - Primary: #2563EB, Secondary: #10B981, Neutral: Gray scale
     - Success: #22C55E, Warning: #F59E0B, Error: #EF4444
   - Follow mobile-first approach with breakpoints:
     - Mobile: < 640px, Tablet: 640px-1023px, Desktop: 1024px+
   - Use Tailwind's spacing scale and typography system
   - Use Shadcn UI components as foundation

3. Apply the state management strategy:
   - Local state: useState/useReducer
   - Global state: Redux Toolkit with normalized store
   - Server state: React Query with proper caching
   - Use context API for theme, auth, and cross-cutting concerns

4. Implement form handling with:
   - React Hook Form with Zod validation schemas
   - Reusable form components with proper error messages
   - Controlled components and loading states
   - Validation on both client and server sides

5. Ensure accessibility compliance (WCAG 2.1 AA):
   - Use semantic HTML and proper keyboard navigation
   - Ensure sufficient color contrast (4.5:1 minimum)
   - Provide text alternatives and proper focus management
   - Use ARIA attributes when necessary
   - WCAG 2.1 Level AA compliance
   - Keyboard navigation
   - Screen reader support
   - Color contrast requirements

## Reference Documentation

For more detailed information, refer to the full Frontend Guidelines Document at:
`d:\samudra-erp\documentation\frontend-guidelines-document.md`