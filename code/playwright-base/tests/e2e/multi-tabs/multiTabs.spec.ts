import { test, expect } from '@playwright/test';

test.use({ storageState: 'rootStorageState.json' });

test('multiple tabs works', async ({ page }) => {
  await page.goto('https://vvbin.cn/next/#/dashboard/analysis');
  await page.locator('.vben-menu-submenu-title:has-text("外部页面")').click();

  const [popup] = await Promise.all([
    // It is important to call waitForEvent before click to set up waiting.
    page.waitForEvent('popup'),
    // Opens popup.
    page.locator('.vben-menu-item:has-text("项目文档(外链)")').click(),
  ]);

  await popup.waitForLoadState();
  const title = await popup.title();
  expect(title).toBe('Home | Vben Admin');
});
