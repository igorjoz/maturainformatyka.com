import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/dev',
  outputDir: './test-results-dev',
  forbidOnly: true,
  workers: 1,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4323',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    // Keep this foreground server separate from Astro's user-managed dev lock.
    command: 'npm run dev -- --port 4323 --ignore-lock',
    url: 'http://127.0.0.1:4323',
    reuseExistingServer: false,
    timeout: 120_000,
    env: { NODE_ENV: 'development', ASTRO_TELEMETRY_DISABLED: '1' },
  },
});
