import { defineConfig, devices } from "@playwright/test";

const playwrightPort = process.env.PLAYWRIGHT_PORT ?? "4173";
const playwrightBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${playwrightPort}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: playwrightBaseUrl,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run dev -- --port ${playwrightPort}`,
    url: playwrightBaseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
