# Cypress VS Playwright
## 原理介绍
## 基础功能对比
### TypeScript支持
**Cypress**

从4.4.0版本开始提供TypeScript支持，配置也非常简单，自身的API有较好的TS类型支持，对于自定义Commands支持度一般，需要自己去写`.d.ts`文件，即使你掌握了基本的ts知识，一开始写起这些声明文件，可能也并不会来的比较顺利
```ts
// code/cypress-base/cypress/types.d.ts
// reference code is written like below to avoid the clash in mocha types.
// in most of the cases, simple <reference types="cypress" /> will do.
/// <reference path="../node_modules/cypress/types/cy-blob-util.d.ts" />
/// <reference path="../node_modules/cypress/types/cy-bluebird.d.ts" />
/// <reference path="../node_modules/cypress/types/cy-minimatch.d.ts" />
/// <reference path="../node_modules/cypress/types/lodash/index.d.ts" />
/// <reference path="../node_modules/cypress/types/sinon/index.d.ts" />
/// <reference path="../node_modules/cypress/types/jquery/index.d.ts" />
/// <reference path="../node_modules/cypress/types/cypress.d.ts" />
/// <reference path="../node_modules/cypress/types/cypress-type-helpers.d.ts" />
/// <reference path="../node_modules/cypress/types/cypress-global-vars.d.ts" />

declare namespace Cypress {
  // add custom Cypress command to the interface Chainable<Subject>
  interface Chainable<Subject = any> {
    // let TS know we have a custom command cy.clickLink(...)
    clickLink(label: string | number | RegExp): void
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Chainable<JQuery<Element>>
    /**
     * Custom command to type a few random words into input elements
     * @param count=3
     * @example cy.get('input').typeRandomWords()
     */
    typeRandomWords(
      count?: number,
      options?: Partial<TypeOptions>
    ): Chainable<JQuery<Element>>
  }

  // add properties the application adds to its "window" object
  // by adding them to the interface ApplicationWindow
  interface ApplicationWindow {
    // let TS know the application's code will add
    // method window.add with the following signature
    add(a: number, b: number): number
  }
}

```

**Playwright**

开箱即用的TS支持，TS开发体验极佳

### Authentication鉴权
**Cypress**

最基本的鉴权处理
- 可以通过UI或者API获取鉴权信息，[通过API的参考文档](https://docs.cypress.io/api/commands/session#Updating-an-existing-login-custom-command)
```ts
// code/cypress-base/cypress/e2e/authentication/auth.spec.cy.ts
import { userInfo } from '../../fixtures/assets/data';

describe('authentication work', () => {
  beforeEach(() => {
    cy.visit('https://vvbin.cn/next/#/login');
    cy.get('input#form_item_account').clear().type(userInfo.root.name);
    cy.get('input#form_item_password').clear().type(userInfo.root.password);
    cy.get('.ant-form-item').last().click();
    cy.url().should('contain', '/dashboard');
  });

  /**
   * 验证右上角的全局搜索功能
   */
  it('global search work', () => {
    /**
     * Arrange准备：登录鉴权
     * Act执行：
     * 1. 点击搜索图标
     * 2. 输入“组件”
     * Assert断言：断言存在搜索结果且第一个搜索结果中包含“组件”两个字
     */
    cy.get('.vben-layout-header-action .anticon-search').click();
    cy.get('.vben-app-search-modal input[placeholder="搜索"]').type('组件');

    // 断言
    cy.get('.vben-app-search-modal-list li').first().should('include.text', '组件');
  });
});
```

鉴权复用
在多个用例之间复用鉴权操作，并且用例之间仍然保持完全独立的最佳实践
- 使用`cy.session`抓取页面session并缓存，避免重复登录（10.6.0版本中，该API仍为实验性API,[详情参考](https://docs.cypress.io/api/commands/session)）
- 通过断言去确保信息已被缓存到session,确保开始运行用例时它是可用的状态

```ts
// code/cypress-base/cypress/support/commands.ts
Cypress.Commands.add('login', (username, password) => {
  cy.session(username, () => {
    cy.visit('https://vvbin.cn/next/#/login');

    cy.get('input#form_item_account').clear().type(username);
    cy.get('input#form_item_password').clear().type(password);
    cy.get('.ant-form-item').last().click();

    cy.url().should('contain', '/dashboard')
  });
});

// code/cypress-base/cypress/e2e/authentication/reuseAuth.spec.cy.ts
import { userInfo } from '../../fixtures/assets/data';

beforeEach(() => {
  cy.login(userInfo.root.name, userInfo.root.password);
});

describe('authentication work', () => {
  it('test case 1 reuse authentication', () => {
    cy.visit('https://vvbin.cn/next/#/');
    cy.get('.vben-layout-header-action .anticon-search').click();
    cy.get('.vben-app-search-modal input[placeholder="搜索"]').type('组件');

    cy.get('.vben-app-search-modal-list li').first().should('include.text', '组件');
  });

  it('test case 2 reuse authentication', () => {
    cy.visit('https://vvbin.cn/next/#/');
    cy.get('.vben-layout-header-action .anticon-search').click();
    cy.get('.vben-app-search-modal input[placeholder="搜索"]').type('组件');

    cy.get('.vben-app-search-modal-list li').first().should('include.text', '组件');
  });
});
```

角色切换
- cypress不支持多tab同时运行，所有的切换都会在一个tab下进行

```ts
// code/cypress-base/cypress/e2e/authentication/switchAuth.spec.cy.ts
import { userInfo } from '../../fixtures/assets/data';

it('authentication switch work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);

  cy.visit('https://vvbin.cn/next/#/');
  cy.get('.vben-layout-header-action .anticon-search').click();
  cy.get('.vben-app-search-modal input[placeholder="搜索"]').type('组件');

  cy.get('.vben-app-search-modal-list li').first().should('include.text', '组件');

  // 切换角色
  cy.login(userInfo.normal.name, userInfo.normal.password);
  cy.visit('https://vvbin.cn/next/#/');

  // 断言角色切换成功
  cy.get('.vben-header-user-dropdown__name').should('have.text', 'test user');
});
```

**Playwright**

最基本的鉴权处理
- 可以通过UI或者API获取鉴权信息，[通过API的参考文档](https://playwright.dev/docs/test-auth)

```ts
// code/playwright-base/tests/modules/authentication/auth.spec.ts
import { test, expect } from '@playwright/test';
import { userInfo } from '../../assets/data/index';

test.describe('authentication work', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://vvbin.cn/next/#/login');
    await page.locator('input#form_item_account').fill(userInfo.root.name);
    await page.locator('input#form_item_password').fill(userInfo.root.password);
    await page.locator('.ant-form-item').last().click();
    await page.waitForURL('**/dashboard/**');
  });

  test('global search work', async ({ page }) => {
    await page.locator('.vben-layout-header-action .anticon-search').click();
    await page.locator('.vben-app-search-modal input[placeholder="搜索"]').fill('组件');

    await expect(page.locator('.vben-app-search-modal-list li').first()).toContainText('组件');
  });
});

```

鉴权复用
- 配置globalSetup，在里面将鉴权信息抓取并保存到本地进行复用
```ts
// code/playwright-base/tests/global-setup/index.ts
import { chromium } from '@playwright/test';
import { userInfo } from '../assets/data/index';

export const saveStorageState = async ({ name, password }: { name: string; password: string }, path: string) => {
  // 启动一个浏览器,每个浏览器可以构造多个context,独立且session隔离
  const browser = await chromium.launch({ headless: true });
  // 每个browserContext可以拥有多个page
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  // 标签页
  const page = await context.newPage();

  await page.goto('https://vvbin.cn/next/#/login');
  await page.locator('input#form_item_account').fill(name);
  await page.locator('input#form_item_password').fill(password);
  await page.locator('.ant-form-item').last().click();
  await page.waitForURL('**/dashboard/**');

  await page.context().storageState({ path });

  await browser.close();
};

export default async function globalSetup() {
  try {
    await saveStorageState(userInfo.root, 'rootStorageState.json');
    await saveStorageState(userInfo.normal, 'normalStorageState.json');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

// code/playwright-base/tests/modules/authentication/reuseAuth.spec.ts
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

```

角色切换
- 可以在一个用例中，打开多个窗口进行不同角色账号的相关操作，而且互不影响
```ts
// code/playwright-base/tests/modules/authentication/switchAuth.spec.ts
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

```

## 测试报告