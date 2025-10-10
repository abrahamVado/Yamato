import { test, expect, type Page } from "@playwright/test"
import { seedDashboardSession } from "./utils/auth"

async function authenticate(page: Page) {
  await seedDashboardSession(page)
}

test.describe("Settings communications", () => {
  test("shows WhatsApp and Email configuration panels", async ({ page }) => {
    //1.- Authenticate so the private settings area becomes available.
    await authenticate(page)

    //2.- Verify the new messaging sections and representative entries render.
    await page.goto("/private/settings")
    await expect(page.getByText("WhatsApp configuration")).toBeVisible()
    await expect(page.getByText("Incident bridge")).toBeVisible()
    await expect(page.getByText("Email configuration")).toBeVisible()
    await expect(page.getByText("Activation digest")).toBeVisible()
  })
})
