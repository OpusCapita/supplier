describe('Supplier Address', function () {

  beforeEach(function () {
    Cypress.config('baseUrl', 'http://localhost:8080');
    cy.visit('/supplier', {});
    cy.get('.nav-tabs > li:nth-child(3) > a').focus().click();
    cy.fixture('../fixtures/companyAddress.json').as('address');
  });

  it('should add company address', function () {
    cy.get('#add-button').click();
    cy.get('.form-control').eq(0).select(this.address.addressType);
    cy.get('.form-control').eq(1).clear().type(this.address.name1);
    cy.get('.form-control').eq(2).clear().type(this.address.name2);
    cy.get('.form-control').eq(3).clear().type(this.address.name3);
    cy.get('.form-control').eq(4).clear().type(this.address.street);
    cy.get('.form-control').eq(5).clear().type(this.address.zipCode);
    cy.get('.form-control').eq(6).clear().type(this.address.city);
    cy.get('.form-control').eq(7).select(this.address.country);
    cy.get('.form-control').eq(8).clear().type(this.address.areaCode);
    cy.get('.form-control').eq(9).clear().type(this.address.state);
    cy.get('.form-control').eq(10).clear().type(this.address.poBox);
    cy.get('.form-control').eq(11).clear().type(this.address.poBoxZipCode);
    cy.get('.form-control').eq(12).clear().type(this.address.phoneNumber);
    cy.get('.form-control').eq(13).clear().type(this.address.faxNumber);
    cy.get('.form-control').eq(14).clear().type(this.address.email);
    cy.get('#address-save').click();
  });

  describe('should display added', function () {
    it('address type', function () {
      cy.get('.row-address-type').last().should('contain', this.address.addressType);
    });

    it('street', function () {
      cy.get('.row-street').last().should('contain', this.address.street);
    });

    it('country', function () {
      cy.get('.row-country').last().should('contain', this.address.country);
    });

    it('zip-code', function () {
      cy.get('.row-zipCode').last().should('contain', this.address.zipCode);
    });

    it('city', function () {
      cy.get('.row-city').last().should('contain', this.address.city);
    });

    it('phone number', function () {
      cy.get('.row-phoneNumber').last().should('contain', this.address.phoneNumber);
    });

    it('fax number', function () {
      cy.get('.row-faxNumber').last().should('contain', this.address.faxNumber);
    });
  });

  describe('should display edited', function () {

    it('street', function () {
      let now = Date.now();
      cy.get('.edit-button').last().click();
      cy.get('.form-control').eq(4).clear().type(now);
      cy.get('#address-save').click();
      cy.get('.row-street').last().should('contain', now);
    });

    it('zip-code', function () {
      let now = Date.now().toString().substr(8, 13);
      cy.get('.edit-button').last().click();
      cy.get('.form-control').eq(5).clear().type(now);
      cy.get('#address-save').click();
      cy.get('.row-zipCode').last().should('contain', now);
    });

    it('city', function () {
      let now = Date.now().toString().substr(8, 13);
      cy.get('.edit-button').last().click();
      cy.get('.form-control').eq(6).clear().type(now);
      cy.get('#address-save').click();
      cy.get('.row-city').last().should('contain', now);
    });

    it('phone number', function () {
      let now = Date.now().toString().substr(8, 13);
      cy.get('.edit-button').last().click();
      cy.get('.form-control').eq(12).clear().type(now);
      cy.get('#address-save').click();
      cy.get('.row-phoneNumber').last().should('contain', now);
    });

    it('fax number', function () {
      let now = Date.now().toString().substr(8, 13);
      cy.get('.edit-button').last().click();
      cy.get('.form-control').eq(13).clear().type(now);
      cy.get('#address-save').click();
      cy.get('.row-faxNumber').last().should('contain', now);
    });
  });
});
