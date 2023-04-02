import user from '../fixtures/user.json'
import { getAmountAsNumber } from '../support/utils.js'


describe('Casino cases', () => {

    var initialWalletSize
    var updatedWalletSize
    var winAmount

    before(() => {
        cy.loginByRequest(user.email)       
    })

    beforeEach(() => {
        cy.restoreLocalStorage()
        cy.visit('/' + Cypress.env('casino'))
        cy.get("button.button.money").then(($text) => {
            initialWalletSize = getAmountAsNumber($text.text())
        })
    })

    afterEach(() => {
        cy.saveLocalStorage()
    })

    /* 
        API response (balance) checks are disabled due inconsistency
    */
    it('Winning first bet of 5 euros', () => {
       // cy.intercept({ method: 'POST', url: '**/operatorApiUrl/wallet/debit' }).as('debitCheck')
       
        cy.get('select').select('€5')
        cy.get('img.option__image').eq(0).click()
        cy.get('div.win.prize').contains('Congratulations!')
        cy.get("span.big").then(($text) => {
            winAmount = getAmountAsNumber($text.text())
        })
        cy.get('div.win.prize.prize--show').should('not.exist')
        /*
        cy.wait('@debitCheck').its('response.body.balance').then((balance) => {
            expect(balance).to.eq(initialWalletSize + winAmount - 5)
        })
        */
        cy.get("button.button.money").then(($text) => {
            updatedWalletSize = getAmountAsNumber($text.text())
        }).then(() => {
            expect(updatedWalletSize).to.eq(initialWalletSize + winAmount - 5)
        })
    })

    it('Winning fourth bet of 250 euros', () => {
       // cy.intercept({ method: 'POST', url: '**/operatorApiUrl/wallet/debit' }).as('debitCheck')
       
        cy.get('select').select('€250')
        cy.get('img.option__image').eq(3).click()
        cy.get('div.win.prize').contains('Congratulations!')
        cy.get("span.big").then(($text) => {
            winAmount = getAmountAsNumber($text.text())
        })
        cy.get('div.win.prize.prize--show').should('not.exist')
        /*
        cy.wait('@debitCheck').its('response.body.balance').then((balance) => {
            expect(balance).to.eq(initialWalletSize + winAmount - 250)
        })
        */
        cy.get("button.button.money").then(($text) => {
            updatedWalletSize = getAmountAsNumber($text.text())
        }).then(() => {
            expect(updatedWalletSize).to.eq(initialWalletSize + winAmount - 250)
        })
    })

    it('Losing second bet of 50 euros', () => {
       // cy.intercept({ method: 'POST', url: '**/operatorApiUrl/wallet/debit' }).as('balanceCheck')
        
        cy.get('select').select('€50')
        cy.get('img.option__image').eq(1).click()
        cy.get('div.loss.prize').contains('Booooh!')
        cy.get('div.loss.prize.prize--show').should('not.exist')
    
       // cy.wait('@balanceCheck').its('response.body.balance').should('eq', initialWalletSize - 50)
        cy.get("button.button.money").then(($text) => {
            updatedWalletSize = getAmountAsNumber($text.text())
          }).then(() => {
            expect(updatedWalletSize).to.eq(initialWalletSize - 50)
          })
    })

    it('Playing third bet of 10 euros', () => {
         cy.get('select').select('€10')
         cy.get('img.option__image').eq(2).click()
         cy.get('h1.glow').then((glow) => {
            if(glow.text().includes('Congratulations')) {
                cy.get("span.big").then(($text) => {
                    winAmount = getAmountAsNumber($text.text())
                })
                cy.get('div.win.prize.prize--show').should('not.exist')
                cy.get("button.button.money").then(($text) => {
                    updatedWalletSize = getAmountAsNumber($text.text())
                }).then(() => {
                    expect(updatedWalletSize).to.eq(initialWalletSize + winAmount - 10)
                })
            } else {
                cy.get('div.loss.prize.prize--show').should('not.exist')
                cy.get("button.button.money").then(($text) => {
                    updatedWalletSize = getAmountAsNumber($text.text())
                }).then(() => {
                    expect(updatedWalletSize).to.eq(initialWalletSize - 10)
                })
            }
         })

     })
})