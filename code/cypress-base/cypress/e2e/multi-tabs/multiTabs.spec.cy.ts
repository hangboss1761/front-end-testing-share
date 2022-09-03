import { userInfo } from '../../fixtures/assets/data/index';
/**
 * 无法实现对应的功能
 */
it.skip('multiple tabs works', () => {
  cy.login(userInfo.root.name, userInfo.root.password);
  cy.visit('https://vvbin.cn/next/#/dashboard/analysis');
  // https://docs.cypress.io/guides/references/trade-offs#Multiple-tabs
  cy.get('.vben-menu-submenu-title').contains('外部页面').click();

  cy.get('.vben-menu-item').contains('项目文档(外链)').click();
  // 对于新打开的tab页，没有操作能力
});
