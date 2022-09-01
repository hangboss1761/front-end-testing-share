/**
 * @author hangboss1761
 * @date 2022/08/28
 * @Description: ts支持demo
 */

describe('typescript works', () => {
  it('test custom command', () => {
    // 自身的api有比较好的类型提示
    cy.visit('cypress/fixtures/test.html');
    cy.dataCy('greeting').should('have.text', 'greeting');
    cy.get('input').typeRandomWords(3);
    cy.clickLink('click me');
  });

  it('test extending AUTWindow', () => {
    cy.visit('cypress/fixtures/test.html');
    // Test Runner window object doesn't have add() function.
    // So, it should fail the type check.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.add = (a: number, b: number) => a + b;

    cy.window().then(win => {
      // AUT add() is defined in the fixture, test.html.
      // So, it should pass the type check.
      return win.add(2, 3);
    });
  });
});
