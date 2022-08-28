/**
 * @author hangboss1761
 * @date 2022/08/28
 * @Description: 本用例仅仅只作为TS的示例DEMO，并不能实际运行
 */

describe.skip('typescript works', () => {
  it('test custom command', () => {
    cy.dataCy('greeting')
  })

  it('test extending AUTWindow', () => {
    // Test Runner window object doesn't have add() function.
    // So, it should fail the type check.
    // @ts-expect-error
    window.add = (a: number, b: number) => a + b

    cy.window().then((win) => {
      // AUT add() is defined in the fixture, test.html.
      // So, it should pass the type check.
      return win.add(2, 3)
    })
  })
})

