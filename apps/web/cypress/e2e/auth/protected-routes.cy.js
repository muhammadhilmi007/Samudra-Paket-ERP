/**
 * Protected Routes E2E Tests
 * Tests route protection and role-based access control
 */

describe('Protected Routes', () => {
  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should redirect unauthenticated users to login page', () => {
    // Try accessing protected routes while logged out
    const protectedRoutes = [
      '/dashboard',
      '/shipments',
      '/customers',
      '/finance',
      '/settings',
      '/reports'
    ];

    protectedRoutes.forEach(route => {
      cy.visit(route);
      cy.url().should('include', '/login');
      cy.findByText(/you must be logged in/i).should('exist');
    });
  });

  it('should allow access to protected routes when authenticated', () => {
    // Log in as admin
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.login(email, password);
      
      // Try accessing protected routes while logged in
      const protectedRoutes = [
        { path: '/dashboard', title: /dashboard/i },
        { path: '/shipments', title: /shipments/i },
        { path: '/customers', title: /customers/i },
        { path: '/finance', title: /finance/i },
        { path: '/settings', title: /settings/i },
        { path: '/reports', title: /reports/i }
      ];

      protectedRoutes.forEach(route => {
        cy.visit(route.path);
        cy.url().should('include', route.path);
        cy.findByRole('heading', { name: route.title }).should('exist');
      });
    });
  });

  it('should enforce role-based access control', () => {
    // Log in as courier (limited access)
    cy.fixture('users').then((users) => {
      const { email, password } = users.courier;
      cy.login(email, password);
      
      // Routes courier should have access to
      const allowedRoutes = [
        { path: '/dashboard', title: /dashboard/i },
        { path: '/shipments', title: /shipments/i }
      ];

      // Routes courier should not have access to
      const restrictedRoutes = [
        '/finance',
        '/reports/financial'
      ];

      // Check allowed routes
      allowedRoutes.forEach(route => {
        cy.visit(route.path);
        cy.url().should('include', route.path);
        cy.findByRole('heading', { name: route.title }).should('exist');
      });

      // Check restricted routes
      restrictedRoutes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', '/unauthorized');
        cy.findByText(/you do not have permission/i).should('exist');
      });
    });
  });

  it('should maintain authentication state across page navigation', () => {
    // Log in as admin
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.login(email, password);
      
      // Navigate through different routes
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
      
      cy.findByRole('link', { name: /shipments/i }).click();
      cy.url().should('include', '/shipments');
      
      cy.findByRole('link', { name: /customers/i }).click();
      cy.url().should('include', '/customers');
      
      cy.findByRole('link', { name: /finance/i }).click();
      cy.url().should('include', '/finance');
      
      // Should still be authenticated
      cy.findByText(users.admin.name).should('exist');
    });
  });

  it('should redirect to the originally requested URL after login', () => {
    // Try to access a protected route while logged out
    cy.visit('/shipments');
    cy.url().should('include', '/login');
    
    // Login
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.findByLabelText(/email/i).type(email);
      cy.findByLabelText(/password/i).type(password);
      cy.findByRole('button', { name: /login/i }).click();
      
      // Should redirect to the originally requested URL
      cy.url().should('include', '/shipments');
    });
  });
});
