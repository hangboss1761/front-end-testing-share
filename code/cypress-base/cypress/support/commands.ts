import 'cypress-file-upload';
import { generateRandomWords } from '../utils/index';

Cypress.Commands.add('login', (username, password) => {
  cy.session(username, () => {
    cy.visit('https://vvbin.cn/next/#/login');

    cy.get('input#form_item_account').clear().type(username);
    cy.get('input#form_item_password').clear().type(password);
    cy.get('.ant-form-item').last().click();

    cy.url().should('contain', '/dashboard');
  });
});

Cypress.Commands.add('dataCy', value => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('clickLink', (label: string | number | RegExp) => {
  cy.get('a').contains(label).click();
});

interface TypeOptions extends Cypress.TypeOptions {
  sensitive: boolean;
}

Cypress.Commands.overwrite<'type', 'element'>('type', (originalFn, element, text, options?: Partial<TypeOptions>) => {
  if (options && options.sensitive) {
    // turn off original log
    options.log = false;
    // create our own log with masked message
    Cypress.log({
      $el: element,
      name: 'type',
      message: '*'.repeat(text.length),
    });
  }

  return originalFn(element, text, options);
});

Cypress.Commands.add(
  'typeRandomWords',
  { prevSubject: ['element'] },
  (subject /* :JQuery<HTMLElement> */, count = 3, options?) => {
    return cy.wrap(subject).type(generateRandomWords(count), options);
  },
);
