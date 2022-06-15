Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Allyson')
        cy.get('#lastName').type('Alves')
        cy.get('#email').type('allyson@hotmail.com')
        cy.get('#open-text-area').type('Teste')
        cy.get('button[type="submit"]').click()
})