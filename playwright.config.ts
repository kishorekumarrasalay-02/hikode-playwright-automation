import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: '.',
  testMatch: [
    'tests/**/*.spec.ts',
    'signup/**/*.spec.ts',
    'profile/**/*.spec.ts',
    'jobs/**/*.spec.ts',
    'events/**/*.spec.ts',
    'coach/**/*.spec.ts',
    'contribute/**/*.spec.ts',
    'my-circle/**/*.spec.ts',
    'my-plans/**/*.spec.ts',
    'my-messages/**/*.spec.ts',
    'e2e/**/*.spec.ts',
  ],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 120_000,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/summary.json' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: true }],
    ['list'],
  ],
  use: {
    baseURL: 'https://www.hikode.me',
    headless: !!process.env.CI,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
