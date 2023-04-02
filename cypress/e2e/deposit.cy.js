import user from '../fixtures/user.json'
import { getAmountAsNumber } from '../support/utils.js'


describe('Deposit cases', () => {

    var initialWalletSize
    var updatedWalletSize

    before(() => {
        cy.loginByRequest(user.email)       
    })

    beforeEach(() => {
        cy.restoreLocalStorage()
        cy.visit('/')
        cy.get("button.button.money").then(($text) => {
            initialWalletSize = getAmountAsNumber($text.text())
        })
        cy.get('button.button.money').click()
    })

    afterEach(() => {
        cy.saveLocalStorage()
    })

    it('Successful card deposit of 100 euros', () => {
        cy.get('button.button.button--deposit').contains('Card').click()
        cy.get('button.button.button--deposit').contains('€100').click()
        cy.get('button.button.button--secondary').contains('Deposit Approved').click()

        cy.get('h3').contains('Your deposit was successful!')
        cy.get('button.button.button--secondary').contains('OK').click()
        cy.get('h1.modal-title').should('not.exist')
        
        cy.get("button.button.money").then(($text) => {
            updatedWalletSize = getAmountAsNumber($text.text())
          }).then(() => {
            expect(updatedWalletSize).to.eq(initialWalletSize + 100)
          })
    })

    it('Failing e-wallet deposit of 10 euros', () => {
        cy.get('button.button.button--deposit').contains('E-wallet').click()
        cy.get('button.button.button--deposit').contains('€10').click()
        cy.get('button.button.button--secondary').contains('Deposit Failed').click()

        cy.get('h3').contains('Uh oh, your deposit was not approved')
        cy.get('div.modal__x').click()

        cy.get("button.button.money").then(($text) => {
            updatedWalletSize = getAmountAsNumber($text.text())
          }).then(() => {
            expect(updatedWalletSize).to.eq(initialWalletSize)
          })
    })

    /*
    Following test fails because bonus isn't applied
    */  
    it('Successful bank deposit of 50 euros with 500% bonus', () => {
        cy.get('select.form-input').select(2)
        cy.get('button.button.button--deposit').contains('Direct Bank').click()
        cy.get('button.button.button--deposit').contains('€50').click()
        cy.get('button.button.button--secondary').contains('Deposit Approved').click()

        cy.get('h3').contains('Your deposit was successful!')
        cy.get('button.button.button--secondary').contains('OK').click()

        cy.get("button.button.money").then(($text) => {
            updatedWalletSize = getAmountAsNumber($text.text())
          }).then(() => {
            expect(updatedWalletSize).to.eq(initialWalletSize + 300)
          })
    })

})