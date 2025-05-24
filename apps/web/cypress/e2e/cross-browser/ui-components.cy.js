/**
 * Cross-Browser Testing for UI Components
 * Tests critical UI components across different browsers
 */

describe('Cross-Browser UI Component Tests', () => {
  beforeEach(() => {
    // Login as admin for testing UI components
    cy.fixture('users').then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
  });

  it('Navigation sidebar should render correctly', () => {
    cy.visit('/dashboard');
    
    // Check sidebar structure
    cy.get('[data-testid="sidebar"]').should('be.visible');
    cy.get('[data-testid="sidebar-logo"]').should('be.visible');
    cy.get('[data-testid="sidebar-menu"]').should('be.visible');
    
    // Check menu items
    cy.get('[data-testid="sidebar-menu-item"]').should('have.length.at.least', 5);
    
    // Check active state
    cy.get('[data-testid="sidebar-menu-item"].active').should('have.length', 1);
    
    // Check hover state
    cy.get('[data-testid="sidebar-menu-item"]').first().realHover();
    cy.get('[data-testid="sidebar-menu-item"]:hover').should('have.css', 'background-color');
  });

  it('Data tables should render and paginate correctly', () => {
    cy.visit('/master-data/employees');
    
    // Check table structure
    cy.get('[data-testid="data-table"]').should('be.visible');
    cy.get('[data-testid="data-table-header"]').should('be.visible');
    cy.get('[data-testid="data-table-row"]').should('have.length.at.least', 1);
    
    // Check pagination
    cy.get('[data-testid="pagination"]').should('be.visible');
    cy.get('[data-testid="pagination-next"]').click();
    cy.get('[data-testid="pagination-page"].active').should('contain', '2');
    
    // Check sorting
    cy.get('[data-testid="data-table-header-cell"]').first().click();
    cy.get('[data-testid="data-table-header-cell"].sorted').should('be.visible');
    
    // Check filtering
    cy.get('[data-testid="data-table-filter"]').type('test');
    cy.get('[data-testid="data-table-row"]').should('have.length.at.most', 10);
  });

  it('Forms should render and validate correctly', () => {
    cy.visit('/master-data/employees/add');
    
    // Check form structure
    cy.get('[data-testid="form"]').should('be.visible');
    cy.get('[data-testid="form-field"]').should('have.length.at.least', 3);
    
    // Check validation
    cy.get('[data-testid="form-submit"]').click();
    cy.get('[data-testid="form-error"]').should('be.visible');
    
    // Check input types
    cy.get('input[type="text"]').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('select').should('be.visible');
    
    // Check input interactions
    cy.get('input[type="text"]').first().type('Test Name');
    cy.get('input[type="text"]').first().should('have.value', 'Test Name');
    
    cy.get('select').first().select(1);
    cy.get('select').first().should('have.value');
  });

  it('Modals should render and function correctly', () => {
    cy.visit('/master-data/employees');
    
    // Open modal
    cy.get('[data-testid="open-modal-button"]').first().click();
    cy.get('[data-testid="modal"]').should('be.visible');
    
    // Check modal structure
    cy.get('[data-testid="modal-header"]').should('be.visible');
    cy.get('[data-testid="modal-body"]').should('be.visible');
    cy.get('[data-testid="modal-footer"]').should('be.visible');
    
    // Check close functionality
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
    
    // Check backdrop click
    cy.get('[data-testid="open-modal-button"]').first().click();
    cy.get('[data-testid="modal-backdrop"]').click('topRight');
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Buttons should render in different states correctly', () => {
    cy.visit('/dashboard');
    
    // Check button variants
    cy.get('[data-testid="button-primary"]').should('be.visible');
    cy.get('[data-testid="button-secondary"]').should('be.visible');
    cy.get('[data-testid="button-danger"]').should('be.visible');
    
    // Check button states
    cy.get('[data-testid="button-disabled"]').should('be.disabled');
    
    // Check button with icon
    cy.get('[data-testid="button-with-icon"]').should('be.visible');
    cy.get('[data-testid="button-with-icon"] svg').should('be.visible');
    
    // Check loading state
    cy.get('[data-testid="button-loading"]').should('be.visible');
    cy.get('[data-testid="button-loading"] .spinner').should('be.visible');
  });

  it('Tabs should render and switch correctly', () => {
    cy.visit('/master-data/employees/emp-001');
    
    // Check tabs structure
    cy.get('[data-testid="tabs"]').should('be.visible');
    cy.get('[data-testid="tab"]').should('have.length.at.least', 3);
    
    // Check active tab
    cy.get('[data-testid="tab"].active').should('have.length', 1);
    
    // Switch tabs
    cy.get('[data-testid="tab"]').eq(1).click();
    cy.get('[data-testid="tab"]').eq(1).should('have.class', 'active');
    cy.get('[data-testid="tab-panel"]').should('be.visible');
  });

  it('Dropdown menus should render and function correctly', () => {
    cy.visit('/dashboard');
    
    // Check dropdown
    cy.get('[data-testid="dropdown-trigger"]').first().click();
    cy.get('[data-testid="dropdown-menu"]').should('be.visible');
    
    // Check dropdown items
    cy.get('[data-testid="dropdown-item"]').should('have.length.at.least', 2);
    
    // Check item selection
    cy.get('[data-testid="dropdown-item"]').first().click();
    cy.get('[data-testid="dropdown-menu"]').should('not.exist');
    
    // Check outside click
    cy.get('[data-testid="dropdown-trigger"]').first().click();
    cy.get('body').click(0, 0);
    cy.get('[data-testid="dropdown-menu"]').should('not.exist');
  });

  it('Toast notifications should render correctly', () => {
    cy.visit('/dashboard');
    
    // Trigger a toast notification
    cy.window().then((win) => {
      win.showToast('Test notification', 'success');
    });
    
    // Check toast appearance
    cy.get('[data-testid="toast"]').should('be.visible');
    cy.get('[data-testid="toast-success"]').should('be.visible');
    
    // Check toast auto-dismiss
    cy.wait(5000);
    cy.get('[data-testid="toast"]').should('not.exist');
    
    // Check different toast types
    cy.window().then((win) => {
      win.showToast('Error notification', 'error');
    });
    cy.get('[data-testid="toast-error"]').should('be.visible');
    
    cy.window().then((win) => {
      win.showToast('Warning notification', 'warning');
    });
    cy.get('[data-testid="toast-warning"]').should('be.visible');
  });

  it('Responsive layout should adapt to different screen sizes', () => {
    cy.visit('/dashboard');
    
    // Test desktop view
    cy.viewport(1200, 800);
    cy.get('[data-testid="sidebar"]').should('be.visible');
    cy.get('[data-testid="main-content"]').should('be.visible');
    
    // Test tablet view
    cy.viewport(768, 1024);
    cy.get('[data-testid="sidebar"]').should('be.visible');
    cy.get('[data-testid="main-content"]').should('be.visible');
    
    // Test mobile view
    cy.viewport(375, 667);
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    cy.get('[data-testid="sidebar"]').should('not.be.visible');
    
    // Open mobile menu
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="sidebar"]').should('be.visible');
  });
});
