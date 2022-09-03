import { test, expect } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import { remove } from 'fs-extra';

test.use({ storageState: 'rootStorageState.json' });

test('download work', async ({ page }) => {
  await page.goto('https://vvbin.cn/next/#/feat/download');

  const [download] = await Promise.all([
    // It is important to call waitForEvent before click to set up waiting.
    page.waitForEvent('download'),
    page.locator('.ant-btn:has-text("文件流下载")').click(),
  ]);
  const filePath = path.join(__dirname, '../../assets/file-download/text.txt');
  await download.saveAs(filePath);

  expect(await fs.readFile(filePath, { encoding: 'utf-8' })).toContain('text content');
  await remove(filePath);
});

test('upload work', async ({ page }) => {
  await page.goto('https://vvbin.cn/next/#/feat/excel/importExcel');

  const [fileChooser] = await Promise.all([
    // It is important to call waitForEvent before click to set up waiting.
    page.waitForEvent('filechooser'),
    page.locator('.ant-btn:has-text("导入Excel")').click(),
  ]);

  const filePath = path.join(__dirname, '../../assets/file-upload/upload_template.xlsx');

  await fileChooser.setFiles(filePath);

  await expect(page.locator('.ant-table-title:has-text("upload_template.xlsx")')).toBeVisible();
});
