const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: "ge5i8q",
  e2e: {
    experimentalSessionAndOrigin: true,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
