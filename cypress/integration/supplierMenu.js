describe('Supplier Menu', function() {
  beforeEach(function() {
    Cypress.config('baseUrl', 'http://localhost:8080');
    cy.visit('/supplier');
  });

  it('should direct to supplier', function() {
    cy.get('.nav-tabs > li:nth-child(1) > a').focus().click();
    cy.url().should('include', '/supplier');
  });

  it('should direct to registration', function() {
    cy.get('.nav-tabs > li:nth-child(2) > a').focus().click();
    cy.url().should('include', '/registration');
  });

  it('should direct to address', function() {
    cy.get('.nav-tabs > li:nth-child(3) > a').focus().click();
    cy.url().should('include', '/address');
  });

  it('should direct to contact', function() {
    cy.get('.nav-tabs > li:nth-child(4) > a').focus().click();
    cy.url().should('include', '/contact');
  });

  it('should direct to bank', function() {
    cy.get('.nav-tabs > li:nth-child(5) > a').focus().click();
    cy.url().should('include', '/bank');
  });

  it('should direct to profile strength', function() {
    cy.get('.nav-tabs > li:nth-child(6) > a').focus().click();
    cy.url().should('include', '/profile_strength');
  });
});
