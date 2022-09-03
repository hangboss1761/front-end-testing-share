import { userInfo } from '../../fixtures/assets/data/index';
// 此处无法实现期望的效果
it.skip('hover work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);
  cy.visit('https://vvbin.cn/next/#/comp/table/basic');
  /**
   * 不支持hover,https://docs.cypress.io/api/commands/hover
   * 如果hover是通过JS的事件实现，类似mouseover，可以通过trigger('mouseover')来触发
   * 如过不是，那么很有可能无法触发对应的行为，比如这里就无法触发tooltip
   */
  cy.get('.anticon-info-circle').trigger('mouseover');
  cy.get('.ant-tooltip').should('be.visible');
});
