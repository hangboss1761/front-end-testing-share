import { type PlaywrightTestConfig, devices } from '@playwright/experimental-ct-vue';
import istanbul from 'vite-plugin-istanbul';
import vue from '@vitejs/plugin-vue'

const config: PlaywrightTestConfig = {
  testDir: './src',
  testMatch: ['**/components/**/*.spec.{ts,tsx}'],
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    headless: true,
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    ctViteConfig: {
      plugins: [
        vue(),
        istanbul({
          include: 'src/*',
          exclude: ['node_modules'],
          extension: ['.js', '.ts', '.vue'],
          requireEnv: false,
          forceBuildInstrument: true,
        })
      ]
    }
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
