import { test, expect } from '@playwright/experimental-ct-vue2';
import { Button } from 'element-ui';

test('slots work', async ({ mount }) => {
  const ct = await mount(Button, {
    slots: {
      default: 'click me',
    },
  });

  await expect(ct).toContainText('click me');
});

test('jsx slots work', async ({ mount }) => {
  const ct = await mount(<el-button>click me</el-button>);

  await expect(ct).toContainText('click me');
});
