describe('Supplier', function() {
  beforeEach(function() {
    Cypress.config('baseUrl', 'http://localhost:8080');
    cy.visit('/supplier');
    cy.get('.nav-tabs > li:nth-child(2) > a').focus().click();
    cy.url().should('include', '/registration');
    cy.fixture('../fixtures/companyCorrectDetails.json').as('correct');
    cy.fixture('../fixtures/companyIncorrectDetails.json').as('incorrect');
  });

  it('title should be correct', function() {
    cy.title().should('include', 'Supplier Editor')
  });
});
