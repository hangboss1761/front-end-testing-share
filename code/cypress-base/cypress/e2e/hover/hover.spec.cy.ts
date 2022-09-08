import { userInfo } from '../../fixtures/assets/data/index';
it('hover work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);
  cy.visit('https://vvbin.cn/next/#/comp/table/basic');
  /**
   * 不支持hover,https://docs.cypress.io/api/commands/hover
   * 如果hover是通过JS的事件实现，类似mouseover，可以通过trigger('mouseover')来触发
   * 如过不是，可以借助社区提供的https://github.com/dmtrKovalenko/cypress-real-events这个库实现real hover
   */
  cy.get('.anticon-search svg').realHover();
  cy.get('.ant-tooltip').should('be.visible');
});
