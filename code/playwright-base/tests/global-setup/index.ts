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
