import { test, expect } from '@playwright/test';

// 复用登录状态
test.use({ storageState: 'rootStorageState.json' });

test.describe('authentication work', () => {
  test('test case 1 reuse authentication', async ({ page }) => {
    await page.goto('https://vvbin.cn/next/#/');
    await page.locator('.vben-layout-header-action .anticon-search').click();
    await page.locator('.vben-app-search-modal input[placeholder="搜索"]').fill('组件');

    await expect(page.locator('.vben-app-search-modal-list li').first()).toContainText('组件');
  });

  test('test case 2 reuse authentication', async ({ page }) => {
    await page.goto('https://vvbin.cn/next/#/');
    await page.locator('.vben-layout-header-action .anticon-search').click();
    await page.locator('.vben-app-search-modal input[placeholder="搜索"]').fill('组件');

    await expect(page.locator('.vben-app-search-modal-list li').first()).toContainText('组件');
  });
});
