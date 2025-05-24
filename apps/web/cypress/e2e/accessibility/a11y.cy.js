/**
 * Accessibility E2E Tests
 * Tests WCAG 2.1 Level AA compliance for critical pages and components
 * Implements comprehensive accessibility testing with axe-core
 */

describe('Accessibility', () => {
  beforeEach(() => {
    // Load axe for accessibility testing
    cy.injectAxe();
  });

  it('Login page should be accessible', () => {
    cy.visit('/login');
    cy.wait(500); // Wait for page to fully load
    cy.checkA11y(null, {
      includedImpacts: ['critical', 'serious'],
      rules: {
        'color-contrast': { enabled: true },
        'label': { enabled: true },
        'landmark-one-main': { enabled: true },
        'page-has-heading-one': { enabled: true }
      }
    });
  });

  it('Dashboard should be accessible when authenticated', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.login(email, password);
      cy.visit('/dashboard');
      cy.wait(500); // Wait for page to fully load
      cy.injectAxe();
      cy.checkA11y(null, {
        includedImpacts: ['critical', 'serious'],
        rules: {
          'color-contrast': { enabled: true },
          'label': { enabled: true },
          'landmark-one-main': { enabled: true },
          'page-has-heading-one': { enabled: true }
        }
      });
    });
  });

  it('Shipment management page should be accessible', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.login(email, password);
      cy.visit('/shipments');
      cy.wait(500); // Wait for page to fully load
      cy.injectAxe();
      cy.checkA11y(null, {
        includedImpacts: ['critical', 'serious'],
        rules: {
          'color-contrast': { enabled: true },
          'label': { enabled: true },
          'landmark-one-main': { enabled: true },
          'page-has-heading-one': { enabled: true },
          'table-fake-caption': { enabled: true },
          'td-has-header': { enabled: true }
        }
      });
    });
  });

  it('Forms should be accessible', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.login(email, password);
      cy.visit('/shipments/create');
      cy.wait(500); // Wait for page to fully load
      cy.injectAxe();
      cy.checkA11y('form', {
        includedImpacts: ['critical', 'serious'],
        rules: {
          'color-contrast': { enabled: true },
          'label': { enabled: true },
          'label-content-name-mismatch': { enabled: true },
          'label-title-only': { enabled: true },
          'select-name': { enabled: true },
          'form-field-multiple-labels': { enabled: true }
        }
      });
    });
  });

  it('Modal dialogs should be accessible', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.login(email, password);
      cy.visit('/dashboard');
      cy.wait(500); // Wait for page to fully load
      
      // Open a modal dialog
      cy.findByRole('button', { name: /create new/i }).click();
      cy.wait(300); // Wait for modal to open
      
      cy.injectAxe();
      cy.checkA11y('[role="dialog"]', {
        includedImpacts: ['critical', 'serious'],
        rules: {
          'aria-dialog-name': { enabled: true },
          'focus-trap-dialog': { enabled: true },
          'role-img-alt': { enabled: true }
        }
      });
    });
  });

  it('Dark theme should maintain proper contrast', () => {
    cy.fixture('users').then((users) => {
      const { email, password } = users.admin;
      cy.login(email, password);
      cy.visit('/dashboard');
      cy.wait(500); // Wait for page to fully load
      
      // Switch to dark theme
      cy.findByRole('button', { name: /user settings/i }).click();
      cy.findByRole('button', { name: /toggle theme/i }).click();
      cy.wait(300); // Wait for theme to change
      
      cy.injectAxe();
      cy.checkA11y(null, {
        includedImpacts: ['critical', 'serious'],
        rules: {
          'color-contrast': { enabled: true }
        }
      });
    });
  });
});
