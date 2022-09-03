import { test, expect } from '@playwright/test';

test.describe('authentication switch between test', () => {
  test.describe(() => {
    test.use({ storageState: 'rootStorageState.json' });
    test('global search work', async ({ page }) => {
      await page.goto('https://vvbin.cn/next/#/');
      await page.locator('.vben-layout-header-action .anticon-search').click();
      await page.locator('.vben-app-search-modal input[placeholder="搜索"]').fill('组件');

      await expect(page.locator('.vben-app-search-modal-list li').first()).toContainText('组件');
    });
  });

  test.describe(() => {
    test.use({ storageState: 'normalStorageState.json' });
    test('role switch success', async ({ page }) => {
      await page.goto('https://vvbin.cn/next/#/');
      await expect(page.locator('.vben-header-user-dropdown__name')).toHaveText('test user');
    });
  });
});

test('authentication switch in test', async ({ browser }) => {
  // root账号相关的操作与断言
  const rootContext = await browser.newContext({ storageState: 'rootStorageState.json' });
  const rootPage = await rootContext.newPage();

  await rootPage.goto('https://vvbin.cn/next/#/');
  await rootPage.locator('.vben-layout-header-action .anticon-search').click();
  await rootPage.locator('.vben-app-search-modal input[placeholder="搜索"]').fill('组件');

  await expect(rootPage.locator('.vben-app-search-modal-list li').first()).toContainText('组件');

  // 普通账号相关的操作与断言
  const normalContext = await browser.newContext({ storageState: 'normalStorageState.json' });
  const normalPage = await normalContext.newPage();

  await normalPage.goto('https://vvbin.cn/next/#/');
  await expect(normalPage.locator('.vben-header-user-dropdown__name')).toHaveText('test user');
});
