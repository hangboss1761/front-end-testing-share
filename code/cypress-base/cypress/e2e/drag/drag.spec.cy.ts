import { userInfo } from '../../fixtures/assets/data/index';
it('drag work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);

  cy.visit('https://vvbin.cn/next/#/dashboard/analysis');
  cy.get('.vben-menu-item').contains('工作台').click();

  cy.get('.ant-tabs-tab')
    .first()
    .trigger('mousedown')
    .trigger('mousemove', { clientX: 200 })
    .trigger('mouseup', { force: true });
});
