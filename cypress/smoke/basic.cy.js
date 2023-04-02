describe('Verify that application is running', () => {

    it('URL & Content check', () => {
      cy.visit('/')
      cy.url().should('include', 'demo.ft-crm')
      cy.get('#__layout > div').should('be.visible')
    })

  })