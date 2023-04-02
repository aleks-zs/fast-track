const { defineConfig } = require("cypress");

module.exports = defineConfig({

  env: {
      casino: "casino/",
      sports: "sports/",
      lottery: "lottery/",
      notifications: "notifications/",
      consent: "consent/"
  },

  e2e: {
    baseUrl: "https://demo.ft-crm.com/",
    experimentalRunAllSpecs: true,
    screenshotOnRunFailure: false,
    video: false,
    specPattern: 'cypress/**/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here

    },
  },
});
