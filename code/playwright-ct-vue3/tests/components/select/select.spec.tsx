import { test, expect } from '@playwright/experimental-ct-vue';
import { Page, Locator } from '@playwright/test';
import SelectBase from './BaseSelect.vue';
import RemoteFilterSelect from './RemoteFilterSelect.vue';
import { ElButton } from 'element-plus';

const baseOptions = [
  {
    value: '选项1',
    label: '黄金糕',
  },
  {
    value: '选项2',
    label: '双皮奶',
  },
  {
    value: '选项3',
    label: '蚵仔煎',
  },
  {
    value: '选项4',
    label: '龙须面',
  },
  {
    value: '选项5',
    label: '北京烤鸭',
  },
];

const useSelect = (ct: Locator, page: Page) => {
  const pickSelectOption = async ({ text, nth }: { text?: string; nth?: number }) => {
    if (text) {
      await page.locator(`.el-select-dropdown:visible .el-select-dropdown__item :text-is("${text}")`).click();
    } else {
      await page.locator(`.el-select-dropdown:visible .el-select-dropdown__item >> nth=${nth}`).click();
    }
  };

  const openPopover = async () => {
    await ct.locator('.el-input').click();
    // 等待popover动画执行完毕
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(400);
  };

  return {
    pickSelectOption,
    openPopover,
  };
};

test('mount work', async ({ page, mount }) => {
  const ct = await mount(SelectBase, {
    props: {
      // custom props
      options: baseOptions,
    },
  });
  const { openPopover } = useSelect(ct, page);

  await openPopover();

  // Visual comparisons
  await expect(page).toHaveScreenshot();
});

test('custom dropdown class', async ({ page, mount }) => {
  const ct = await mount(SelectBase, {
    props: {
      // component props
      propsParams: {
        popperClass: 'ct-class',
      },
      // custom props
      options: baseOptions,
    },
  });
  const { openPopover } = useSelect(ct, page);

  await openPopover();
  await expect(page.locator('.ct-class.el-select-dropdown')).toBeVisible();
});

test('default value work', async ({ mount }) => {
  const ct = await mount(SelectBase, {
    props: {
      options: baseOptions,
      defaultValue: baseOptions[0].value,
    },
  });

  await expect(ct.locator('.el-input input')).toHaveValue(baseOptions[0].label);
});

test('single select work', async ({ page, mount }) => {
  const ct = await mount(SelectBase, {
    props: {
      options: baseOptions,
      defaultValue: baseOptions[0].value,
    },
  });
  const { pickSelectOption, openPopover } = useSelect(ct, page);

  await openPopover();
  await pickSelectOption({ text: baseOptions[1].label });

  await expect(ct.locator('.el-input input')).toHaveValue(baseOptions[1].label);
});
test('disabled option work', async ({ page, mount }) => {
  const options = [
    {
      value: '选项1',
      label: '黄金糕',
    },
    {
      value: '选项2',
      label: '双皮奶',
      disabled: true,
    },
  ];
  const ct = await mount(SelectBase, {
    props: {
      options: options,
      defaultValue: options[0].value,
    },
  });
  const { pickSelectOption, openPopover } = useSelect(ct, page);

  await openPopover();
  await pickSelectOption({ text: options[1].label });

  await expect(ct.locator('.el-input input')).toHaveValue(options[0].label);
});

test('keyboard operations work', async ({ page, mount }) => {
  const ct = await mount(SelectBase, {
    props: {
      options: baseOptions,
      defaultValue: baseOptions[0].value,
    },
  });
  const { openPopover } = useSelect(ct, page);

  await openPopover();

  await ct.locator('.el-input').press('ArrowDown');
  await ct.locator('.el-input').press('ArrowDown');
  await ct.locator('.el-input').press('Enter');

  await expect(ct.locator('.el-input input')).toHaveValue(baseOptions[1].label);
});

test('clearable work', async ({ mount }) => {
  const ct = await mount(SelectBase, {
    props: {
      propsParams: {
        clearable: true,
      },
      options: baseOptions,
      defaultValue: baseOptions[0].value,
    },
  });

  await ct.locator('.el-input').hover();
  await ct.locator('.el-select__icon:visible').click();

  await expect(ct.locator('.el-input input')).toBeEmpty();
});

test('filterable work', async ({ page, mount }) => {
  const ct = await mount(SelectBase, {
    props: {
      propsParams: {
        filterable: true,
      },
      options: baseOptions,
    },
  });

  await ct.locator('.el-input input').click();
  await ct.locator('.el-input input').fill(baseOptions[0].label);

  await expect(page.locator('.el-select-dropdown:visible .el-select-dropdown__item:visible')).toHaveCount(1);
  await expect(
    page.locator(`.el-select-dropdown:visible .el-select-dropdown__item:has-text("${baseOptions[0].label}")`),
  ).toBeVisible();
});

test('filterable with custom filter-method', async ({ page, mount }) => {
  const ct = await mount(RemoteFilterSelect, {
    props: {
      options: baseOptions,
    },
  });
  const query = 'Alabama';

  await ct.locator('.el-input input').click();
  await ct.locator('.el-input input').fill(query);

  await expect(page.locator('.el-select-dropdown:visible .el-select-dropdown__item:visible')).toHaveCount(1);
  await expect(
    page.locator(`.el-select-dropdown:visible .el-select-dropdown__item:has-text("${query}")`),
  ).toBeVisible();
});

test('event work', async ({ page, mount }) => {
  const messages: string[] = [];

  const ct = await mount(SelectBase, {
    props: {
      propsParams: {
        clearable: true,
      },
      eventsParams: {
        change: () => messages.push('change-trigger'),
        clear: () => messages.push('clear-trigger'),
        'visible-change': () => messages.push('visible-change-trigger'),
      },
      options: baseOptions,
    },
  });
  const { pickSelectOption, openPopover } = useSelect(ct, page);

  await openPopover();
  await pickSelectOption({ text: baseOptions[0].label });

  await ct.locator('.el-input').hover();
  await ct.locator('.el-select__icon:visible').click();

  expect(messages).toContain('change-trigger');
  expect(messages).toContain('clear-trigger');
  expect(messages).toContain('visible-change-trigger');
});

test('jsx slots work', async ({ mount }) => {
  const ct = await mount(<ElButton>click me</ElButton>);

  await expect(ct).toContainText('click me');
});

test('slots work', async ({ mount }) => {
  const ct = await mount(ElButton, {
    slots: {
      default: 'click me',
    },
  });

  await expect(ct).toContainText('click me');
});
