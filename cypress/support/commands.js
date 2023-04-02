Cypress.Commands.add("login", (email) => {
    cy.visit('/')
    cy.get('button.button').contains('Returning user').click()
    cy.get('input[placeholder="Enter Email"]').type(email)
    cy.get('button.input-button').click()

    Cypress.on('uncaught:exception', (err, runnable, promise) => {
        if (promise) {
          return false
        }
      })
})

/*
Actual authentication token isn't used in the requests but user id is used instead. 
Skipping request to get the actual token since authentication can be performed by populating local storage prior to getting token.
Also adding user balance.  
*/
Cypress.Commands.add("loginByRequest", (email) => {  
    var userId 
    cy.request({
      method: 'POST',
      url: 'https://demo.ft-crm.com/operatorApiUrl/login',
      headers: {
        'x-api-key': 'EXZbrNhnJHRbbih' 
      },
      body: {email: email}
    }).then(({ body }) => {
      userId = body.id
    }).then(() => {

      cy.request({
        method: 'GET',
        url: `https://demo.ft-crm.com/operatorApiUrl/wallet/${userId}`,
        headers: {
          'x-api-key': 'EXZbrNhnJHRbbih' 
        }
      }).then(({ body }) => {
       window.localStorage.setItem('vuex', `{"user":{"userId":${userId},"balance":${body.balance},"authToken":"${userId}","bonuses":[]},"lottery":{}}`)
      })

    })
  
    Cypress.on('uncaught:exception', (err, runnable, promise) => {
      if (promise) {
        return false
      }
    })

})

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});