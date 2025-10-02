# Playwright Test Validation

This document captures the exact steps used to install the Playwright browser dependencies and execute the end-to-end suite.

## Installation Steps

1. Ensure project dependencies are installed from the `web` workspace:
   ```bash
   cd web
   pnpm install
   ```
2. Install the Playwright managed browsers and supporting system packages:
   ```bash
   pnpm exec playwright install --with-deps
   ```

## Test Execution

Run the full production build followed by the Playwright test suite:
```bash
pnpm run test:e2e
```

The command builds the Next.js application and then executes all Playwright specs via `pnpm exec playwright test`. All 40 tests completed successfully.
