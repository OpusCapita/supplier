describe('Registration', function () {
  beforeEach(function () {
    Cypress.config('baseUrl', 'http://localhost:8080');
    cy.visit('/supplier');
    cy.fixture('../fixtures/registration.json').as('company');
  });

  it('should register a company', function () {
    cy.get('.nav-tabs > li:nth-child(2) > a').click();
    cy.get('.form-control').eq(0).clear().type(this.company.name);
    cy.get('.form-control').eq(1).clear().type(this.company.registrationNumber);
    cy.get('.form-control').eq(2).clear().type(this.company.cityOfRegistration);
    cy.get('.form-control').eq(3).select(this.company.countryOfRegistration);
    cy.get('.form-control').eq(4).clear().type(this.company.taxNumber);
    cy.get('.form-control').eq(5).clear().type(this.company.vatNumber);
    cy.get('.supplier-registration-form-submit').find('.btn-primary').click();
    cy.get('#supplier-registration h3').should('contain', 'Supplier already exist');
  })
});
