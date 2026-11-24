import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Only run Playwright e2e tests in /tests
  testDir: './tests',
  testMatch: '**/*.spec.{ts,js}',
  // Exclude __tests__ folders from Playwright
  outputDir: 'playwright-report',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Start the API server and the web app before the tests run. */
  webServer: [
    {
      command: 'cd server && npm run build && node dist/src/main.js',
      url: 'http://localhost:3000/api/docs',
      reuseExistingServer: !process.env.CI,
      timeout: 180 * 1000,
      env: {
        NODE_ENV: 'test',
        DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://derby:derby@localhost:5432/pinewood_derby',
        API_BEARER_TOKEN: process.env.API_BEARER_TOKEN ?? 'local-dev-token',
        USE_SSL: 'false',
      },
    },
    {
      command: 'cd app && npm run build && npm run app:start',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 300 * 1000,
      env: {
        NEXT_PUBLIC_DERBY_API_URL: process.env.NEXT_PUBLIC_DERBY_API_URL ?? 'http://localhost:3000',
        NEXT_PUBLIC_DERBY_API_TOKEN: process.env.API_BEARER_TOKEN ?? 'local-dev-token',
      },
    },
  ],
});
