import { test, expect } from '@playwright/test';

test.use({ storageState: 'rootStorageState.json' });

test('iframe work', async ({ page }) => {
  await page.goto('https://vvbin.cn/next/#/frame/doc');

  const frame = page.frameLocator('.vben-iframe-page__main');

  await frame.locator('a:has-text("快速开始")').click();
  await expect(frame.locator('.sidebar-link-item:has-text("介绍")')).toBeVisible();
  expect(1).toBe(1);
});
