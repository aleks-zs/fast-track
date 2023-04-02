import user from '../fixtures/user.json'
import { getAmountAsNumber } from '../support/utils.js'


describe('Lottery cases', () => {

    var initialWalletSize
    var updatedWalletSize

    before(() => {
        cy.loginByRequest(user.email)       
    })

    beforeEach(() => {
        cy.restoreLocalStorage()
        cy.visit('/' + Cypress.env('lottery'))
        cy.get("button.button.money").then(($text) => {
            initialWalletSize = getAmountAsNumber($text.text())
        })
    })

    afterEach(() => {
        cy.saveLocalStorage()
    })

    it('Buy single ticket', () => {
        cy.intercept({ method: 'POST', url: '**/wallet/debit' }).as('lotteryCheck')

        cy.get('div.column.column--wrap').contains('Buy tickets').click()

        cy.wait('@lotteryCheck').its('response.statusCode').should('eq', 200)
        cy.get("button.button.money").then(($text) => {
            updatedWalletSize = getAmountAsNumber($text.text())
        }).then(() => {
            expect(updatedWalletSize).to.eq(initialWalletSize - 5)
        })
    })

    it('Buys 10 draw tickets', () => {
        cy.intercept({ method: 'POST', url: '**/wallet/debit' }).as('lotteryCheck')
        
        cy.get('select').select(9)
        cy.get('div.column.column--wrap').contains('Buy tickets').click()

        cy.wait('@lotteryCheck').its('response.statusCode').should('eq', 200)
        cy.get("button.button.money").then(($text) => {
            updatedWalletSize = getAmountAsNumber($text.text())
        }).then(() => {
            expect(updatedWalletSize).to.eq(initialWalletSize - 50)
        })
    })

    it('Add another ticket and select several numbers', () => {
        cy.get('button.button').contains('Add another ticket').click()
        cy.get('div.lottery-tickets > div.lottery-ticket').eq(1).contains('span','1').click()
        cy.get('div.lottery-tickets > div.lottery-ticket').eq(1).contains('span','10').click()
        cy.get('div.lottery-tickets > div.lottery-ticket').eq(1).contains('span','27').click()
    })

})
