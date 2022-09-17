import { test, expect } from '@playwright/experimental-ct-vue2';

test('slots work', async ({ mount }) => {
  const ct = await mount(<el-button>click me</el-button>);

  await expect(ct).toContainText('click me');
});
