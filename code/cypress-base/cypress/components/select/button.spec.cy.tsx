import { ElButton } from 'element-plus';

it('slot work', () => {
  cy.mount(() => <ElButton>click me</ElButton>);

  cy.get('button').should('have.text', 'click me');
});
