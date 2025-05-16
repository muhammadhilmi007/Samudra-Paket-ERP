# Frontend Guidelines Document

## Overview

This document outlines the frontend development standards, architecture, and best practices for the Samudra Paket ERP system. It serves as a guide for developers to ensure consistency, maintainability, and high-quality implementation across all frontend components.

## Architecture

### Atomic Design Methodology

The frontend follows the Atomic Design methodology, organizing components into five distinct levels:

1. **Atoms**: Basic building blocks (buttons, inputs, labels)
2. **Molecules**: Simple groups of UI elements functioning together (form fields, search bars)
3. **Organisms**: Complex UI components composed of molecules and atoms (navigation bars, forms)
4. **Templates**: Page layouts without real content (dashboard layout, form page layout)
5. **Pages**: Specific instances of templates with real content

```
/components
  /atoms
    /Button
    /Input
    /Typography
  /molecules
    /FormField
    /SearchBar
    /StatusBadge
  /organisms
    /DataTable
    /NavigationBar
    /ShipmentForm
  /templates
    /DashboardLayout
    /FormPageLayout
    /ReportLayout
  /pages
    /Dashboard
    /Shipments
    /Reports
```

### Tech Stack

- **Framework**: Next.js with JavaScript
- **State Management**: Redux Toolkit for global state, React Query for server state
- **Styling**: Tailwind CSS with custom theme configuration
- **UI Components**: Shadcn UI as the component library foundation
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: Axios for API requests, React Query for caching and state management
- **Routing**: Next.js built-in routing with middleware for auth protection
- **Internationalization**: next-i18next for multi-language support

## Coding Standards

### File and Folder Structure

```
/src
  /components      # Atomic design components
  /hooks           # Custom React hooks
  /lib             # Utility functions and constants
  /pages           # Next.js pages
  /services        # API service functions
  /store           # Redux store configuration
  /styles          # Global styles and Tailwind config
  /types           # TypeScript type definitions
```

### Naming Conventions

- **Directories**: Use kebab-case (e.g., `form-components`)
- **Files**: Use camelCase for utility files (e.g., `apiService.js`)
- **Components**: Use PascalCase for component files (e.g., `ShipmentCard.jsx`)
- **Hooks**: Prefix with `use` (e.g., `useShipmentData.js`)
- **Context**: Suffix with `Context` (e.g., `AuthContext.js`)
- **Redux**: Suffix with `Slice` for Redux slices (e.g., `shipmentSlice.js`)

### Component Structure

```javascript
// Import statements
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';

// Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const { t } = useTranslation('common');
  
  // State and other hooks
  
  // Helper functions
  
  // Effects
  
  // Render
  return (
    <div className="component-wrapper">
      {/* Component content */}
    </div>
  );
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

// Default props
ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

## Styling Guidelines

### Color Palette

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB', // Primary brand color
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#1E3A8A',
        },
        secondary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Secondary brand color
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        info: '#3B82F6',
      },
    },
  },
};
```

### Typography

- **Font Family**: Inter for all text
- **Base Size**: 16px (1rem)
- **Scale**:
  - xs: 0.75rem (12px)
  - sm: 0.875rem (14px)
  - base: 1rem (16px)
  - lg: 1.125rem (18px)
  - xl: 1.25rem (20px)
  - 2xl: 1.5rem (24px)
  - 3xl: 1.875rem (30px)
  - 4xl: 2.25rem (36px)

### Spacing

- Use Tailwind's spacing scale for consistency
- Base spacing unit: 0.25rem (4px)
- Common values:
  - 1: 0.25rem (4px)
  - 2: 0.5rem (8px)
  - 4: 1rem (16px)
  - 6: 1.5rem (24px)
  - 8: 2rem (32px)
  - 12: 3rem (48px)
  - 16: 4rem (64px)

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1279px
- **Large Desktop**: >= 1280px

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
};
```

## State Management

### Redux Toolkit for Global State

- Use Redux Toolkit for global application state
- Create slices for distinct domains (auth, shipments, etc.)
- Use selectors for accessing state
- Use thunks for async operations

```javascript
// Example slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { shipmentService } from '../services/shipmentService';

export const fetchShipments = createAsyncThunk(
  'shipments/fetchShipments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await shipmentService.getShipments(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Synchronous reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default shipmentSlice.reducer;
```

### React Query for Server State

- Use React Query for server state management
- Create custom hooks for data fetching
- Implement caching and invalidation strategies

```javascript
// Example React Query hook
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { shipmentService } from '../services/shipmentService';

export const useShipments = (params) => {
  return useQuery(
    ['shipments', params],
    () => shipmentService.getShipments(params).then(res => res.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      keepPreviousData: true,
    }
  );
};

export const useCreateShipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (newShipment) => shipmentService.createShipment(newShipment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('shipments');
      },
    }
  );
};
```

## Form Handling

### React Hook Form with Zod

- Use React Hook Form for form state management
- Use Zod for schema validation
- Create reusable form components

```javascript
// Example form with validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const shipmentSchema = z.object({
  senderName: z.string().min(3, 'Sender name is required'),
  senderPhone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  senderAddress: z.string().min(5, 'Address is too short'),
  recipientName: z.string().min(3, 'Recipient name is required'),
  recipientPhone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  recipientAddress: z.string().min(5, 'Address is too short'),
  weight: z.number().positive('Weight must be positive'),
  serviceType: z.enum(['regular', 'express', 'same-day']),
});

const ShipmentForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      serviceType: 'regular',
    },
  });

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* Form fields */}
    </form>
  );
};
```

## API Integration

### Service Layer

- Create service modules for API communication
- Use Axios for HTTP requests
- Implement request/response interceptors

```javascript
// API service setup
import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh logic here
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

```javascript
// Shipment service example
import apiClient from './apiClient';

export const shipmentService = {
  getShipments: (params) => apiClient.get('/shipments', { params }),
  getShipmentById: (id) => apiClient.get(`/shipments/${id}`),
  createShipment: (data) => apiClient.post('/shipments', data),
  updateShipment: (id, data) => apiClient.put(`/shipments/${id}`, data),
  deleteShipment: (id) => apiClient.delete(`/shipments/${id}`),
};
```

## Performance Optimization

### Code Splitting

- Use dynamic imports for route-based code splitting
- Lazy load heavy components

```javascript
// Dynamic import example
import dynamic from 'next/dynamic';

const DynamicDataTable = dynamic(() => import('../components/organisms/DataTable'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable server-side rendering if needed
});
```

### Image Optimization

- Use Next.js Image component for automatic optimization
- Implement responsive images with appropriate sizes

```javascript
import Image from 'next/image';

const ProfileImage = ({ user }) => (
  <Image
    src={user.avatarUrl}
    alt={`${user.name}'s profile picture`}
    width={64}
    height={64}
    className="rounded-full"
    priority={false}
    placeholder="blur"
    blurDataURL="data:image/png;base64,..."
  />
);
```

### Memoization

- Use React.memo for expensive components
- Use useMemo and useCallback for expensive calculations and callbacks

```javascript
import React, { useMemo, useCallback } from 'react';

const ShipmentList = React.memo(({ shipments, onSelect }) => {
  const sortedShipments = useMemo(() => {
    return [...shipments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [shipments]);

  const handleSelect = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <ul>
      {sortedShipments.map((shipment) => (
        <li key={shipment.id} onClick={() => handleSelect(shipment.id)}>
          {shipment.trackingNumber}
        </li>
      ))}
    </ul>
  );
});
```

## Accessibility

### WCAG 2.1 Level AA Compliance

- Implement proper semantic HTML
- Ensure keyboard navigation
- Maintain sufficient color contrast
- Provide text alternatives for non-text content
- Design for screen readers

### Accessibility Checklist

- Use semantic HTML elements (`<button>`, `<nav>`, `<header>`, etc.)
- Include proper ARIA attributes when needed
- Ensure focus states are visible
- Implement skip links for keyboard navigation
- Test with screen readers
- Validate with accessibility tools

```javascript
// Accessible button example
const AccessibleButton = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'}`}
    aria-busy={loading ? 'true' : 'false'}
  >
    {loading ? (
      <span className="flex items-center">
        <span className="animate-spin mr-2" aria-hidden="true">⟳</span>
        <span>Processing...</span>
      </span>
    ) : children}
  </button>
);
```

## Testing

### Unit Testing

- Use Jest for unit testing
- Test components with React Testing Library
- Focus on behavior, not implementation details

```javascript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import ShipmentForm from './ShipmentForm';

describe('ShipmentForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders the form correctly', () => {
    render(<ShipmentForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/sender name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/recipient address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    render(<ShipmentForm onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(await screen.findByText(/sender name is required/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    render(<ShipmentForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/sender name/i), { target: { value: 'John Doe' } });
    // Fill other required fields...
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      senderName: 'John Doe',
    }));
  });
});
```

### Integration Testing

- Test component integration with Cypress
- Focus on user flows and interactions

```javascript
// Cypress test example
describe('Shipment Creation Flow', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'password');
    cy.visit('/shipments/new');
  });

  it('creates a new shipment successfully', () => {
    cy.get('[name="senderName"]').type('John Doe');
    cy.get('[name="senderPhone"]').type('1234567890');
    // Fill other fields...
    
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/shipments');
    cy.contains('Shipment created successfully').should('be.visible');
  });
});
```

## Internationalization

### Multi-language Support

- Use next-i18next for translations
- Implement language switching
- Support right-to-left (RTL) languages if needed

```javascript
// i18n setup
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
    localeDetection: true,
  },
};
```

```javascript
// Using translations in components
import { useTranslation } from 'next-i18next';

const Header = () => {
  const { t } = useTranslation('common');
  
  return (
    <header>
      <h1>{t('app.title')}</h1>
      <p>{t('app.description')}</p>
    </header>
  );
};
```

## Error Handling

### Error Boundaries

- Implement error boundaries to catch rendering errors
- Provide fallback UI for error states

```javascript
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong. Please try again.</div>;
    }

    return this.props.children;
  }
}
```

### API Error Handling

- Implement consistent error handling for API requests
- Show appropriate error messages to users

```javascript
import { toast } from 'react-toastify';

const handleApiError = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message || 'An unexpected error occurred';
  
  switch (status) {
    case 401:
      toast.error('Your session has expired. Please log in again.');
      // Redirect to login
      break;
    case 403:
      toast.error('You do not have permission to perform this action.');
      break;
    case 404:
      toast.error('The requested resource was not found.');
      break;
    case 422:
      toast.error('Validation error. Please check your input.');
      break;
    case 500:
      toast.error('Server error. Please try again later.');
      break;
    default:
      toast.error(message);
  }
  
  return message;
};
```

## Mobile Responsiveness

### Mobile-First Approach

- Design for mobile devices first, then enhance for larger screens
- Use Tailwind's responsive utilities
- Test on various device sizes

```javascript
// Responsive component example
const Dashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="col-span-1 md:col-span-2 lg:col-span-4">
      <SummaryStats />
    </div>
    <div className="col-span-1 md:col-span-1 lg:col-span-2">
      <RecentShipments />
    </div>
    <div className="col-span-1 md:col-span-1 lg:col-span-2">
      <PerformanceChart />
    </div>
  </div>
);
```

## Documentation

### Component Documentation

- Document components with JSDoc comments
- Create a component library with Storybook

```javascript
/**
 * Button component with various styles and states
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant ('primary', 'secondary', 'outline', 'ghost')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {boolean} props.isDisabled - Whether the button is disabled
 * @param {Function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Button content
 * @returns {React.ReactElement} Button component
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  onClick,
  children,
}) => {
  // Component implementation
};
```

## Conclusion

This frontend guidelines document provides a comprehensive framework for developing the Samudra Paket ERP system's frontend components. By following these guidelines, developers can ensure consistency, maintainability, and high-quality implementation across the entire application.