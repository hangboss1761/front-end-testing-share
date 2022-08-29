/**
 * @author hangboss1761
 * @date 2022/08/28
 * @Description: authentication switch
 */

import { userInfo } from '../../fixtures/assets/data';

it('authentication switch work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);

  cy.visit('https://vvbin.cn/next/#/');
  cy.get('.vben-layout-header-action .anticon-search').click();
  cy.get('.vben-app-search-modal input[placeholder="搜索"]').type('组件');

  cy.get('.vben-app-search-modal-list li').first().should('include.text', '组件');

  // 切换角色
  cy.login(userInfo.normal.name, userInfo.normal.password);
  cy.visit('https://vvbin.cn/next/#/');

  // 断言角色切换成功
  cy.get('.vben-header-user-dropdown__name').should('have.text', 'test user');
});
