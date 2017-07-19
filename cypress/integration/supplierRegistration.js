describe('Supplier Registration', function() {

  beforeEach(function() {
    Cypress.config('baseUrl', 'http://localhost:8080');
    cy.visit('/supplier');
    cy.get('.nav-tabs > li:nth-child(2) > a').focus().click();
    cy.url().should('include', '/registration');
    cy.fixture('../fixtures/companyCorrectDetails.json').as('correct');
    cy.fixture('../fixtures/companyIncorrectDetails.json').as('incorrect');
  });

  it('should register a company if details are correct', function() {
    cy.get('.form-control').eq(0).clear().type(this.correct.name);
    cy.get('.form-control').eq(1).clear().type(this.correct.registrationNumber);
    cy.get('.form-control').eq(2).clear().type(this.correct.cityOfRegistration);
    cy.get('.form-control').eq(3).select(this.correct.countryOfRegistration);
    cy.get('.form-control').eq(4).clear().type(this.correct.taxNumber);
    cy.get('.form-control').eq(5).clear().type(this.correct.vatNumber);
    cy.get('.supplier-registration-form-submit').find('.btn-primary').click();
    cy.get('#supplier-registration h3').should('contain', 'Supplier already exist');
  });

  it('should thrown an error VAT is incorrect', function() {
    cy.get('.form-control').eq(5).clear().type(this.incorrect.vatNumber);
    cy.get('.supplier-registration-form-submit').find('.btn-primary').click();
    cy.get('.error-message').should('contain', 'Value is not a valid EU VAT number');
  });

  it('should thrown an error Global Location Number is incorrect', function() {
    cy.get('.form-control').eq(6).clear().type(this.incorrect.globalLocationNumber);
    cy.get('.supplier-registration-form-submit').find('.btn-primary').click();
    cy.get('.error-message').should('contain', 'Value is not a valid Global Location Number');
  });

  it('should thrown an error D-U-N-S number is incorrect', function() {
    cy.get('.form-control').eq(7).clear().type(this.incorrect.dunsNumber);
    cy.get('.supplier-registration-form-submit').find('.btn-primary').click();
    cy.get('.error-message').should('contain', 'Value is not a valid D-U-N-S');
  });

});
