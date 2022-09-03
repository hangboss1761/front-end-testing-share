import { type PlaywrightTestConfig, devices } from '@playwright/experimental-ct-vue';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  testMatch: ['**/components/**/**.spec.ts', '**/components/**/**.spec.tsx'],
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    headless: true,
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        channel: 'chrome',
        ...devices['Desktop Chrome'],
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
};

export default config;
