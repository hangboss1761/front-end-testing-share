import { userInfo } from '../../fixtures/assets/data/index';
import * as path from 'path';

it('download work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);

  // 下载的文件在下次运行时会清除，可以不用额外remove
  const downloadsFolder = Cypress.config('downloadsFolder');
  const downloadedFilename = path.join(downloadsFolder, 'testName.txt');

  cy.visit('https://vvbin.cn/next/#/feat/download');
  cy.get('.ant-btn').contains('文件流下载').click();

  cy.readFile(downloadedFilename).should('contain', 'text content');
});

it('upload work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);
  const filePath = 'assets/file-upload/upload_template.xlsx';

  cy.visit('https://vvbin.cn/next/#/feat/excel/importExcel');
  cy.get('[type="file"]').attachFile(filePath);

  cy.get('.ant-table-title').should('contain.text', 'upload_template.xlsx');
});
