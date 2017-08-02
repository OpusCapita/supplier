describe('Supplier Contact', function() {
  beforeEach(function() {
    Cypress.config('baseUrl', 'http://localhost:8080');
    cy.visit('/supplier');
    cy.get('.nav-tabs > li:nth-child(4) > a').focus().click();
    cy.fixture('../fixtures/companyContact.json').as('contact');
  });

  it('should add company address', function() {
    cy.get('#add-button').click();
    cy.get('.form-control').eq(0).select(this.contact.contactType);
    cy.get('.form-control').eq(1).select(this.contact.department);
    cy.get('.form-control').eq(2).type(this.contact.salutation);
    cy.get('.form-control').eq(3).type(this.contact.firstName);
    cy.get('.form-control').eq(4).type(this.contact.lastName);
    cy.get('.form-control').eq(5).type(this.contact.phoneNumber);
    cy.get('.form-control').eq(6).type(this.contact.phoneNumber);
    cy.get('.form-control').eq(7).type(this.contact.faxNumber);
    cy.get('.form-control').eq(8).clear().type(this.contact.email);
    cy.get('#save-button').click();
  });

  xit('should display added company address', function() {
    cy.get('.row-address-type').last().should('contain', this.contact.addressType);
    cy.get('.row-street').last().should('contain', this.contact.street);
    cy.get('.row-zipCode').last().should('contain', this.contact.zipCode);
    cy.get('.row-city').last().should('contain', this.contact.city);
    cy.get('.row-country').last().should('contain', this.contact.country);
    cy.get('.row-phoneNumber').last().should('contain', this.contact.phoneNumber);
    cy.get('.row-faxNumber').last().should('contain', this.contact.faxNumber);
  });

  xit('should edit company address', function() {
    let now = Date.now();
    cy.get('.edit-address-button').last().click();
    cy.get('.form-control').eq(4).clear().type(now);
    cy.get('#save-button').click();
    cy.get('.row-street').last().should('contain', now);
  });
});
