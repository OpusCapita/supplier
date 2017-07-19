describe('Supplier Address', function() {
  beforeEach(function() {
    Cypress.config('baseUrl', 'http://localhost:8080');
    cy.visit('/supplier');
    cy.get('.nav-tabs > li:nth-child(3) > a').focus().click();
    cy.fixture('../fixtures/companyAddress.json').as('address');
  });

  it('should add company address', function() {
    cy.get('#add-button').click();
    cy.get('.form-control').eq(0).select(this.address.type);
    cy.get('.form-control').eq(1).clear().type(this.address.name1);
    cy.get('.form-control').eq(2).clear().type(this.address.name2);
    cy.get('.form-control').eq(3).clear().type(this.address.name3);
    cy.get('.form-control').eq(4).clear().type(this.address.street);
    cy.get('.form-control').eq(5).clear().type(this.address.zipCode);
    cy.get('.form-control').eq(6).clear().type(this.address.city);
    cy.get('.form-control').eq(7).select(this.address.country);
  });
});
