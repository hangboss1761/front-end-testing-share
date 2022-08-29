/**
 * @author hangboss1761
 * @date 2022/08/28
 * @Description: authentication
 */

import { userInfo } from '../../fixtures/assets/data';

describe('authentication work', () => {
  beforeEach(() => {
    cy.visit('https://vvbin.cn/next/#/login');
    cy.get('input#form_item_account').clear().type(userInfo.root.name);
    cy.get('input#form_item_password').clear().type(userInfo.root.password);
    cy.get('.ant-form-item').last().click();
    cy.url().should('contain', '/dashboard');
  });

  /**
   * 验证右上角的全局搜索功能
   */
  it('global search work', () => {
    /**
     * Arrange准备：登录鉴权
     * Act执行：
     * 1. 点击搜索图标
     * 2. 输入“组件”
     * Assert断言：断言存在搜索结果且第一个搜索结果中包含“组件”两个字
     */
    cy.get('.vben-layout-header-action .anticon-search').click();
    cy.get('.vben-app-search-modal input[placeholder="搜索"]').type('组件');

    // 断言
    cy.get('.vben-app-search-modal-list li').first().should('include.text', '组件');
  });
});
