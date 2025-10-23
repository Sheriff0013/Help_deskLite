const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/api', // URL de base de votre app
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,                    // Enregistrer les vidéos
    screenshotOnRunFailure: true,   // Screenshots en cas d'échec
    defaultCommandTimeout: 10000,   // Timeout par défaut
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Configuration des plugins
    },
  },
})