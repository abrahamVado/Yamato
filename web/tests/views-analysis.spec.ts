import { test, expect, type Page } from "@playwright/test"
import { seedDashboardSession } from "./utils/auth"

async function authenticate(page: Page) {
  await seedDashboardSession(page)
}

test.describe("Views analysis localization", () => {
  test("renders enumerated intelligence report in English", async ({ page }) => {
    //1.- Authenticate to reach the private analysis surface.
    await authenticate(page)

    //2.- Verify the English headings and enumerated entries render.
    await page.goto("/private/views-analysis")
    const main = page.getByRole("main")
    await expect(main.getByText("View intelligence report")).toBeVisible()
    await expect(main.getByText("Map dashboard").first()).toBeVisible()
    await expect(
      main.getByText("Statuses reflect the staging plan captured during the last platform review.")
    ).toBeVisible()
  })

  test("switches copy to Spanish when locale is persisted", async ({ page }) => {
    //1.- Persist the locale before hydration so the provider loads the Spanish dictionary.
    await page.addInitScript(() => {
      window.localStorage.setItem("locale", "es")
    })

    await authenticate(page)

    //2.- Confirm the headline and sample rows reflect the translated copy.
    await page.goto("/private/views-analysis")
    const main = page.getByRole("main")
    await expect(main.getByText("Informe de inteligencia de vistas")).toBeVisible()
    await expect(main.getByText("Panel de mapa").first()).toBeVisible()
  })
})
