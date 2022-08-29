/**
 * @author hangboss1761
 * @date 2022/08/28
 * @Description: authentication reuse
 */

import { userInfo } from '../../fixtures/assets/data';

beforeEach(() => {
  cy.login(userInfo.root.name, userInfo.root.password);
});

describe('authentication work', () => {
  it('test case 1 reuse authentication', () => {
    cy.visit('https://vvbin.cn/next/#/');
    cy.get('.vben-layout-header-action .anticon-search').click();
    cy.get('.vben-app-search-modal input[placeholder="搜索"]').type('组件');

    cy.get('.vben-app-search-modal-list li').first().should('include.text', '组件');
  });

  it('test case 2 reuse authentication', () => {
    cy.visit('https://vvbin.cn/next/#/');
    cy.get('.vben-layout-header-action .anticon-search').click();
    cy.get('.vben-app-search-modal input[placeholder="搜索"]').type('组件');

    cy.get('.vben-app-search-modal-list li').first().should('include.text', '组件');
  });
});
