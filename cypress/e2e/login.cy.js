import user from '../fixtures/user.json'


describe('Login cases', () => {

    it('Login successful', () => {
        cy.intercept({ method: 'POST', url: '**/operatorApiUrl/login' }).as('loginResponse')
      
        cy.login(user.email)
      
        cy.wait('@loginResponse').its('response.statusCode').should('eq', 200)
        cy.get('button.button.money').should('be.visible')
    })

    it('Wrong email', () => {
        const alertShown = cy.stub().as("alertShown")
        cy.on('window:alert', alertShown)
        cy.intercept({ method: 'POST', url: '**/operatorApiUrl/login' }).as('loginResponse')
      
        cy.login("not@registered.email")

        cy.wait('@loginResponse').its('response.statusCode').should('eq', 500)
        cy.get("@alertShown").should("have.been.calledOnceWith", "Sorry, we could not log you in. Check your email to make sure it´s spelled correctly.")
    })

})