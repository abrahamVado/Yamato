import { defineConfig } from "@playwright/test";

export default defineConfig({
  //1.- Keep tests inside the dedicated directory for clarity.
  testDir: "./tests",
  //2.- Disable full parallelism to keep the dev server load predictable during API checks.
  fullyParallel: false,
  //3.- Provide a shared base URL to simplify request fixture usage.
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
  },
  //4.- Launch the production Next.js server before running the suite.
  webServer: {
    command: "pnpm run start:test",
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
