// @ts-check
const { defineConfig } = require('eslint-define-config');
module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:playwright/playwright-test',
  ],
  rules: {
    'prettier/prettier': ['error'],
    '@typescript-eslint/no-var-requires': 'off',
  },
});
