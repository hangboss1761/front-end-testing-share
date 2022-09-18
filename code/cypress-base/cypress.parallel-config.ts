/**
 * @author hangboss1761
 * @date 2022/09/18
 * @Description: 单机器上的并行配置,主要是单机器中的并发执行无法通过cypress-mochawesome-reporter顺利生成HTML报告
 */

import { defineConfig } from 'cypress';
import { initPlugin } from '@frsource/cypress-plugin-visual-regression-diff/dist/plugins';

module.exports = defineConfig({
  projectId: 'ge5i8q',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'multi-reporter-config.json',
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
    },
  },
  component: {
    specPattern: 'cypress/components/parallel/**/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      initPlugin(on, config);
    },
  },
});
