import { test, expect } from '@playwright/test';

test.use({ storageState: 'rootStorageState.json' });

test('drag work', async ({ page }) => {
  await page.goto('https://vvbin.cn/next/#/comp/modal');
  await page.locator('.ant-btn:has-text("打开弹窗1")').click();

  const target = page.locator('.ant-modal .ant-modal-header');
  await target.dispatchEvent('mousedown');
  await target.dispatchEvent('mousemove', { clientX: 800 });
  await target.dispatchEvent('mousedup');

  await page.goto('https://vvbin.cn/next/#/flow/flowChart');
  const conditionNode = page.locator('.lf-dnd-item').nth(4);
  const canvasArea = page.locator('.lf-drag-able').first();
  await conditionNode.dragTo(canvasArea);

  await expect(page.locator('.lf-node-content:has-text("条件判断")')).toBeVisible();
});
