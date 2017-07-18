Cypress.addParentCommand("visitRegistration", function() {
  cy.visit("/login");
  cy.get('.nav-tabs > li:nth-child(2) > a').focus().click();
});
