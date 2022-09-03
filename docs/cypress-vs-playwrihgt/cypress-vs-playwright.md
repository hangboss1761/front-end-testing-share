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

### Hover事件支持
**Cypress**

不支持Hover事件
```ts
// code/cypress-base/cypress/e2e/hover/hover.spec.cy.ts
import { userInfo } from '../../fixtures/assets/data/index';
// 此处无法实现期望的效果
it.skip('hover work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);
  cy.visit('https://vvbin.cn/next/#/comp/table/basic');
  /**
   * 不支持hover,https://docs.cypress.io/api/commands/hover
   * 如果hover是通过JS的事件实现，类似mouseover，可以通过trigger('mouseover')来触发
   * 如过不是，那么很有可能无法触发对应的行为，比如这里就无法触发tooltip
   */
  cy.get('.anticon-info-circle').trigger('mouseover');
  cy.get('.ant-tooltip').should('be.visible');
});


```

**Playwright**

完美支持

```ts
// code/playwright-base/tests/modules/hover/hover.spec.ts
import { test, expect } from '@playwright/test';

test.use({ storageState: 'rootStorageState.json' });

test('hover work', async ({ page }) => {
  await page.goto('https://vvbin.cn/next/#/comp/table/basic');
  await page.locator('.anticon-info-circle').hover();
  await expect(page.locator('.ant-tooltip')).toBeVisible();
});
```

### 拖拽
**Cypress**

满足基本的拖拽需求
```ts
// code/cypress-base/cypress/e2e/drag/drag.spec.cy.ts
import { userInfo } from '../../fixtures/assets/data/index';
it('drag work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);

  cy.visit('https://vvbin.cn/next/#/dashboard/analysis');
  cy.get('.vben-menu-item').contains('工作台').click();

  cy.get('.ant-tabs-tab')
    .first()
    .trigger('mousedown')
    .trigger('mousemove', { clientX: 200 })
    .trigger('mouseup', { force: true });
});

```

**Playwright**

拖拽相关API比较丰富，如`dispatchEvent`、`locator.dragTo(target[, options])`、`page.dragAndDrop(source, target[, options])`

```ts
// code/playwright-base/tests/modules/drag/drag.spec.ts
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
```

### 文件上传、下载
**Cypress**

官网上暂时没有读到上传相关的文档说明，不过可以通过`cypress-file-uploadl`这个库来实现上传，如果你要测试的上传功能实现时`<input type="file />`不存在或者在后期动态创建，那么可能你没有办法通过它来实现上传文件了
```ts
// code/cypress-base/cypress/e2e/downloadAndUpload/downAndUp.spec.cy.ts
import { userInfo } from '../../fixtures/assets/data/index';
import * as path from 'path';

it('download work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);

  // 下载的文件在下次运行时会清除，可以不用额外remove
  const downloadsFolder = Cypress.config('downloadsFolder');
  const downloadedFilename = path.join(downloadsFolder, 'testName.txt');

  cy.visit('https://vvbin.cn/next/#/feat/download');
  cy.get('.ant-btn').contains('文件流下载').click();

  cy.readFile(downloadedFilename).should('contain', 'text content');
});

it('upload work', () => {
  cy.login(userInfo.root.name, userInfo.root.password);
  const filePath = 'assets/file-upload/upload_template.xlsx';

  cy.visit('https://vvbin.cn/next/#/feat/excel/importExcel');
  cy.get('[type="file"]').attachFile(filePath);

  cy.get('.ant-table-title').should('contain.text', 'upload_template.xlsx');
});

```

**Playwright**

提供`setInputFiles`、`waitForEvent('filechooser')`，可以灵活的选择上传方式
```ts
// code/playwright-base/tests/modules/downloadAndUpload/downAndUp.spec.ts
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

```

### iframe支持
**Cypress**

支持，但是API易用性一般
```ts
// code/cypress-base/cypress/e2e/iframe/iframe.spec.cy.ts
const getIframeBody = () => {
  return (
    cy
      .get('iframe[data-cy="the-frame"]')
      // Cypress yields jQuery element, which has the real
      // DOM element under property "0".
      // From the real DOM iframe element we can get
      // the "document" element, it is stored in "contentDocument" property
      // Cypress "its" command can access deep properties using dot notation
      // https://on.cypress.io/its
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
  );
};

it('iframe work', () => {
  cy.visit('cypress/fixtures/iframe_demo.html');

  const iframeBody = getIframeBody();
  iframeBody.find('#sb_form_q').type('百度');
});

```

**Playwright**

iframe相关的API基本与普通页面一致，使用方便便捷

```ts
// code/playwright-base/tests/modules/iframe/iframe.spec.ts
import { test, expect } from '@playwright/test';

test.use({ storageState: 'rootStorageState.json' });

test('iframe work', async ({ page }) => {
  await page.goto('https://vvbin.cn/next/#/frame/doc');

  const frame = page.frameLocator('.vben-iframe-page__main');

  await frame.locator('a:has-text("快速开始")').click();
  await expect(frame.locator('.sidebar-link-item:has-text("介绍")')).toBeVisible();
});


```

### 多Tab支持
**Cypress**

受限于Cypress运行在浏览器中的设计，它不支持多个Tab同时运行，[这里](https://docs.cypress.io/guides/references/trade-offs#Multiple-tabs)有一些曲线救国的实现方式，但是也非常有局限性
```ts
// code/cypress-base/cypress/e2e/multi-tabs/multiTabs.spec.cy.ts
import { userInfo } from '../../fixtures/assets/data/index';
/**
 * 无法实现对应的功能
 */
it.skip('multiple tabs works', () => {
  cy.login(userInfo.root.name, userInfo.root.password);
  cy.visit('https://vvbin.cn/next/#/dashboard/analysis');
  // https://docs.cypress.io/guides/references/trade-offs#Multiple-tabs
  cy.get('.vben-menu-submenu-title').contains('外部页面').click();

  cy.get('.vben-menu-item').contains('项目文档(外链)').click();
  // 对于新打开的tab页，没有操作能力
});

```

**Playwright**

完美支持，能够通过多种方式监听新窗口、新tab页面打开，并且对打开后的页面具有完整地操作能力

```ts
// code/playwright-base/tests/modules/multi-tabs/multiTabs.spec.ts
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

```

### 网络请求
**Cypress**

支持拦截请求前后，发起请求
```ts
cy.intercept({
  method: 'POST',
  url: '/myApi',
}).as('apiCheck')

cy.visit('/')
cy.wait('@apiCheck').then((interception) => {
  assert.isNotNull(interception.response.body, '1st API call has data')
})

cy.wait('@apiCheck').then((interception) => {
  assert.isNotNull(interception.response.body, '2nd API call has data')
})

cy.wait('@apiCheck').then((interception) => {
  assert.isNotNull(interception.response.body, '3rd API call has data')
})
```

**Playwright**

支持拦截并修改请求、代理请求、发起请求，可以比较准确的控制监听哪一个操作后触发的请求

```ts

const [request] = await Promise.all([
  // Waits for the next response with the specified url
  page.waitForResponse('https://example.com/resource'),
  // Triggers the response
  page.click('button.triggers-response'),
]);

const [response] = await Promise.all([
  page.waitForResponse('**/api/fetch_data'),
  page.locator('button#update').click(),
]);

```

### 断言
**Cypress**

内部捆绑了`Chai`这个断言库，主要的风格如下（[官方文档](https://docs.cypress.io/guides/references/assertions)）
```ts
cy.get('li.selected').should('have.length', 3)
cy.get('form').find('input').should('not.have.class', 'disabled')
cy.get('li.hidden').should('not.be.visible')
cy.get('[data-testid="loading"]').should('not.exist')
```

**Playwright**

使用了jest的`expect`，并且自己也提供了一些特有的断言方法。并且提供了`re-testing`的特性（[官方文档](https://playwright.dev/docs/test-assertions)）。

```ts
expect(success).toBeTruthy();

await expect(page.locator('.status')).toHaveText('Submitted');
```
Playwright会re-testing Node直到它内部存在文本”Submitted“，在这个过程中它会一遍又一遍的去抓取Node并做检查，存在一个超时时间，默认5s且可配

### 调试
**Cypress**
- 通过video与页面快照进行调试
- 在`cypress open` mode中调试，可以断点、单步运行、在控制台查看日志
- 如何排查ci里面的错误？
xx
```ts
// code/cypress-base/cypress/e2e/hover/hover.spec.cy.ts

```

**Playwright**

xxx

```ts
```

### xx
**Cypress**

xx
```ts
// code/cypress-base/cypress/e2e/hover/hover.spec.cy.ts

```

**Playwright**

xxx

```ts
```

### xx
**Cypress**

xx
```ts
// code/cypress-base/cypress/e2e/hover/hover.spec.cy.ts

```

**Playwright**

xxx

```ts
```

### xx
**Cypress**

xx
```ts
// code/cypress-base/cypress/e2e/hover/hover.spec.cy.ts

```

**Playwright**

xxx

```ts
```

## 测试报告

## 其他问题

### Cypress中`cy.visit()`方法的缺陷

`cy.visit()`方法需要等待页面`load`事件触发才算完成，且不可配置。如果页面的资源比较多且部分资源加载比较慢，`load`事件迟迟不触发，只能延长`cy.visit()`的超时时间等待事件触发，可能会严重影响用例执行速度([相关issue](https://github.com/cypress-io/cypress/issues/440))；在playwright中类似的方法为`page.goto()`，可以灵活的配置监听`"load"|"domcontentloaded"|"networkidle"|"commit"`事件（[配置说明](https://playwright.dev/docs/api/class-page#page-goto)），则不会存在这样的问题

### Cypress中`it.only()`的缺陷

使用`cypress run`运行测试时，`it.only()`无法单独运行用例

```
/**
  * Indicates this test should be executed exclusively.
  *
  * - _Only available when invoked via the mocha CLI._
  */
only: ExclusiveTestFunction;
```