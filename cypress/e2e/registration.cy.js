import user from '../fixtures/user.json'
import { createNewEmail } from '../support/utils.js'


describe('Registration  cases', () => {
 
  beforeEach(() => {
    cy.visit('/')
    cy.get('button.button.register').click()
    cy.get('button.button.button--intro').contains('I GET IT, CONTINUE').click()
  })

  it('Registration successful', () => {
    const newEmail = createNewEmail()
    
    cy.get('input[placeholder="Enter Email"]').type(newEmail)
    cy.get('button.input-button').click()

    cy.get('input.phone-number-input').first().type('+44')
    cy.get('input.phone-number-input').last().type('7654321')
    cy.get('button.input-button').click()

    cy.get('input.input').type(user.fullname)
    cy.get('button.input-button').click()

    cy.get('input[placeholder="Password"]').type(user.password);
    cy.get('button.input-button').click()

    cy.get('h3').contains('Your registration is complete!')
  })

  it('Registration failed due taken email', () => {
    const alertShown = cy.stub().as("alertShown")
    cy.on('window:alert', alertShown)

    cy.get('input[placeholder="Enter Email"]').type(user.email)
    cy.get('button.input-button').click()

    cy.get('input.phone-number-input').first().type('+44')
    cy.get('input.phone-number-input').last().type('7654321')
    cy.get('button.input-button').click()

    cy.get('input.input').type(user.fullname)
    cy.get('button.input-button').click()

    cy.get('input[placeholder="Password"]').type(user.password);
    cy.get('button.input-button').click()

    cy.get("@alertShown").should("have.been.calledOnceWith", "Email already registered")
  })

})