/**
 * Authentication Flow E2E Tests
 * Tests login, protected routes, and logout functionality
 */

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.findByRole('heading', { name: /login/i }).should('exist');
    cy.findByLabelText(/email/i).should('exist');
    cy.findByLabelText(/password/i).should('exist');
    cy.findByRole('button', { name: /login/i }).should('exist');
  });

  it('should show validation errors for empty fields', () => {
    cy.findByRole('button', { name: /login/i }).click();
    cy.findByText(/email is required/i).should('exist');
    cy.findByText(/password is required/i).should('exist');
  });

  it('should show an error for invalid credentials', () => {
    cy.findByLabelText(/email/i).type('invalid@example.com');
    cy.findByLabelText(/password/i).type('wrongpassword');
    cy.findByRole('button', { name: /login/i }).click();
    cy.findByText(/invalid email or password/i).should('exist');
  });

  it('should successfully log in with valid credentials', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.findByLabelText(/email/i).type(email);
      cy.findByLabelText(/password/i).type(password);
      cy.findByRole('button', { name: /login/i }).click();
      
      // Should redirect to dashboard after successful login
      cy.url().should('include', '/dashboard');
      
      // Should display user info in the header
      cy.findByText(users.admin.name).should('exist');
    });
  });

  it('should redirect to login when accessing protected route while logged out', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
    cy.findByText(/you must be logged in/i).should('exist');
  });

  it('should successfully log out', () => {
    // Log in first
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.findByLabelText(/email/i).type(email);
      cy.findByLabelText(/password/i).type(password);
      cy.findByRole('button', { name: /login/i }).click();
      
      // Verify logged in
      cy.url().should('include', '/dashboard');
      
      // Open user settings menu and click logout
      cy.findByRole('button', { name: /user settings/i }).click();
      cy.findByRole('button', { name: /logout/i }).click();
      
      // Should redirect to login page after logout
      cy.url().should('include', '/login');
      
      // Verify logged out by trying to access dashboard
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
    });
  });

  it('should persist authentication across page refreshes', () => {
    // Log in first
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.findByLabelText(/email/i).type(email);
      cy.findByLabelText(/password/i).type(password);
      cy.findByRole('button', { name: /login/i }).click();
      
      // Verify logged in
      cy.url().should('include', '/dashboard');
      
      // Refresh the page
      cy.reload();
      
      // Should still be on dashboard after refresh
      cy.url().should('include', '/dashboard');
      cy.findByText(users.admin.name).should('exist');
    });
  });
});
