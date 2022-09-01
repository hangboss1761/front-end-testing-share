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
  plugins: ['@typescript-eslint', 'cypress'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': ['error'],
    '@typescript-eslint/no-var-requires': 'off',
  },
});
