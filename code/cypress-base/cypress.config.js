const { defineConfig } = require('cypress');
import { initPlugin } from '@frsource/cypress-plugin-visual-regression-diff/dist/plugins';

module.exports = defineConfig({
  projectId: 'ge5i8q',
  e2e: {
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: true,
    // only run tests in specified file
    // specPattern: 'cypress/e2e/downloadAndUpload/downAndUp.spec.cy.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    // excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    setupNodeEvents(on, config) {
      initPlugin(on, config);
    },
  },
  component: {
    specPattern: 'cypress/components/**/*.cy.{js,jsx,ts,tsx}',
    // excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      initPlugin(on, config);
    },
  },
});
