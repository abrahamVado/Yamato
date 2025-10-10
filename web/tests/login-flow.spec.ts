import { test, expect } from "@playwright/test"

const LOGIN_ENDPOINT_PATTERN = "**/auth/login"

const SECURE_DASHBOARD_PATTERN = "**/secure/dashboard"

test.describe("Public login flow", () => {
  test("persists Sanctum token and redirects to the dashboard", async ({ page }) => {
    //1.- Stub the Laravel login endpoint so we can inspect the payload and return a deterministic token.
    let capturedPayload: Record<string, unknown> | undefined
    await page.route(LOGIN_ENDPOINT_PATTERN, async (route) => {
      capturedPayload = route.request().postDataJSON() as Record<string, unknown>
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ token: "demo-sanctum-token" }),
        headers: { "content-type": "application/json" },
      })
    })

    //2.- Stub the secure dashboard probe in case the shell performs an authenticated fetch post-login.
    await page.route(SECURE_DASHBOARD_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: { id: 1, name: "Demo User", email: "demo.user@example.com" },
          meta: { section: "dashboard" },
        }),
        headers: { "content-type": "application/json" },
      })
    })

    //3.- Navigate to the login form and submit credentials that should be forwarded to Laravel.
    await page.goto("/public/login")
    await page.getByLabel("Email").fill("operator@example.com")
    await page.getByLabel("Password").fill("super-secret")
    await page.getByRole("button", { name: "Sign in" }).click()

    //4.- Wait for the redirect into the private dashboard once authentication succeeds.
    await page.waitForURL(/\/private\/dashboard/)
    await expect(page.url()).toContain("/private/dashboard")

    //5.- Confirm the Sanctum token persisted to localStorage for subsequent authenticated requests.
    await expect.poll(async () => {
      return page.evaluate(() => window.localStorage.getItem("yamato.authToken"))
    }).toBe("demo-sanctum-token")

    //6.- Validate the forwarded payload matches the Laravel controller contract.
    await expect.poll(() => capturedPayload).not.toBeUndefined()
    expect(capturedPayload).toMatchObject({
      email: "operator@example.com",
      password: "super-secret",
      remember: true,
    })
  })
})
