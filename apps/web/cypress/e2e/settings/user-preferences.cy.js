/**
 * User Preferences E2E Tests
 * Tests theme switching and language selection functionality
 */

describe('User Preferences', () => {
  beforeEach(() => {
    // Log in before each test
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.login(email, password);
      cy.visit('/dashboard');
    });
  });

  it('should toggle between light and dark themes', () => {
    // Verify initial theme (default is light)
    cy.get('html').should('have.class', 'light');
    cy.get('html').should('not.have.class', 'dark');
    
    // Open user settings menu
    cy.findByRole('button', { name: /user settings/i }).click();
    
    // Click theme toggle
    cy.findByRole('button', { name: /toggle theme/i }).click();
    
    // Verify theme changed to dark
    cy.get('html').should('have.class', 'dark');
    cy.get('html').should('not.have.class', 'light');
    
    // Toggle back to light theme
    cy.findByRole('button', { name: /toggle theme/i }).click();
    
    // Verify theme changed back to light
    cy.get('html').should('have.class', 'light');
    cy.get('html').should('not.have.class', 'dark');
  });

  it('should switch between languages', () => {
    // Verify initial language (default is Indonesian)
    cy.findByText(/dasbor/i).should('exist');
    
    // Open user settings menu
    cy.findByRole('button', { name: /pengaturan pengguna/i }).click();
    
    // Click language toggle to switch to English
    cy.findByRole('button', { name: /ubah bahasa/i }).click();
    
    // Verify language changed to English
    cy.findByText(/dashboard/i).should('exist');
    
    // Open user settings menu again
    cy.findByRole('button', { name: /user settings/i }).click();
    
    // Click language toggle to switch back to Indonesian
    cy.findByRole('button', { name: /change language/i }).click();
    
    // Verify language changed back to Indonesian
    cy.findByText(/dasbor/i).should('exist');
  });

  it('should persist theme preference across page refreshes', () => {
    // Open user settings menu
    cy.findByRole('button', { name: /user settings/i }).click();
    
    // Click theme toggle to switch to dark theme
    cy.findByRole('button', { name: /toggle theme/i }).click();
    
    // Verify theme changed to dark
    cy.get('html').should('have.class', 'dark');
    
    // Refresh the page
    cy.reload();
    
    // Verify dark theme persisted after refresh
    cy.get('html').should('have.class', 'dark');
  });

  it('should persist language preference across page refreshes', () => {
    // Open user settings menu
    cy.findByRole('button', { name: /pengaturan pengguna/i }).click();
    
    // Click language toggle to switch to English
    cy.findByRole('button', { name: /ubah bahasa/i }).click();
    
    // Verify language changed to English
    cy.findByText(/dashboard/i).should('exist');
    
    // Refresh the page
    cy.reload();
    
    // Verify English language persisted after refresh
    cy.findByText(/dashboard/i).should('exist');
  });

  it('should apply theme to all components correctly', () => {
    // Open user settings menu
    cy.findByRole('button', { name: /user settings/i }).click();
    
    // Click theme toggle to switch to dark theme
    cy.findByRole('button', { name: /toggle theme/i }).click();
    
    // Verify dark theme applied to key components
    cy.get('nav').should('have.css', 'background-color', 'rgb(17, 24, 39)'); // Sidebar
    cy.get('header').should('have.css', 'background-color', 'rgb(31, 41, 55)'); // Header
    
    // Switch back to light theme
    cy.findByRole('button', { name: /toggle theme/i }).click();
    
    // Verify light theme applied to key components
    cy.get('nav').should('have.css', 'background-color', 'rgb(255, 255, 255)'); // Sidebar
    cy.get('header').should('have.css', 'background-color', 'rgb(255, 255, 255)'); // Header
  });
});
