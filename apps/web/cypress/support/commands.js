// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import Testing Library commands
import '@testing-library/cypress/add-commands';

// Custom command for logging in
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.findByLabelText(/email/i).type(email);
    cy.findByLabelText(/password/i).type(password);
    cy.findByRole('button', { name: /login/i }).click();
    cy.url().should('include', '/dashboard');
  });
});

// Custom command for checking authentication state
Cypress.Commands.add('isAuthenticated', () => {
  return cy.window().its('store').invoke('getState').its('auth.isAuthenticated');
});

// Custom command for selecting theme
Cypress.Commands.add('selectTheme', (theme) => {
  cy.window().its('store').then((store) => {
    store.dispatch({ type: 'ui/setTheme', payload: theme });
  });
});

// Custom command for selecting language
Cypress.Commands.add('selectLanguage', (language) => {
  cy.window().its('store').then((store) => {
    store.dispatch({ type: 'ui/setLanguage', payload: language });
  });
});

// Custom command for checking if an element is visible in the viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height();
  const rect = subject[0].getBoundingClientRect();
  
  expect(rect.top).to.be.lessThan(bottom);
  expect(rect.bottom).to.be.greaterThan(0);
  
  return subject;
});

// Custom command for testing accessibility
Cypress.Commands.add('checkA11y', (context = null, options = null) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});
