/// <reference types="cypress" />

Cypress.Commands.add('waitForNewsAPI', () => {
    cy.intercept('GET', '/api/news').as('newsAPI');
    cy.wait('@newsAPI');
});
