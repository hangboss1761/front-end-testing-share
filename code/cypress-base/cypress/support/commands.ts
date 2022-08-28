/**
 * @author hangboss1761
 * @date 2022/08/28
 * @Description:
 */

import { generateRandomWords } from '../utils/index'

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})

interface TypeOptions extends Cypress.TypeOptions {
  sensitive: boolean
}

Cypress.Commands.overwrite<'type', 'element'>(
  'type',
  (originalFn, element, text, options?: Partial<TypeOptions>) => {
    if (options && options.sensitive) {
      // turn off original log
      options.log = false
      // create our own log with masked message
      Cypress.log({
        $el: element,
        name: 'type',
        message: '*'.repeat(text.length),
      })
    }

    return originalFn(element, text, options)
  }
)

Cypress.Commands.add(
  'typeRandomWords',
  { prevSubject: ['element'] },
  (subject /* :JQuery<HTMLElement> */, count = 3, options?) => {
    return cy.wrap(subject).type(generateRandomWords(count), options)
  }
)