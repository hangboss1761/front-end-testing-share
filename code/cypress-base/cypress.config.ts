import { defineConfig } from 'cypress';
import { initPlugin } from '@frsource/cypress-plugin-visual-regression-diff/dist/plugins';

const { some } = require('lodash');
const del = require('del');

module.exports = defineConfig({
  projectId: 'ge5i8q',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'default-reporter-config.json',
  },
  video: true,
  e2e: {
    chromeWebSecurity: false,
    experimentalSessionAndOrigin: true,
    // only run tests in specified file
    // specPattern: 'cypress/e2e/downloadAndUpload/downAndUp.spec.cy.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    // excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    setupNodeEvents(on, config) {
      initPlugin(on, config);
      require('cypress-mochawesome-reporter/plugin')(on);

      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const failures = some(results.tests, (test: any) => {
            return some(test.attempts, { state: 'failed' });
          });
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            return del(results.video);
          }
        }
      });
    },
  },
  component: {
    specPattern: 'cypress/components/**/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      initPlugin(on, config);
      require('cypress-mochawesome-reporter/plugin')(on);

      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const failures = some(results.tests, (test: any) => {
            return some(test.attempts, { state: 'failed' });
          });
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            return del(results.video);
          }
        }
      });
    },
  },
});
