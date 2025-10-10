import { test, expect, type Page } from "@playwright/test"
import { seedDashboardSession } from "./utils/auth"

type MapView = {
  path: string
  marker: string
}

async function authenticate(page: Page) {
  await seedDashboardSession(page)
}

test.describe("Map experiences", () => {
  const mapViews: MapView[] = [
    { path: "/private/map", marker: "Geospatial operations map" },
    { path: "/private/map-reports", marker: "Spatial reports studio" },
    { path: "/private/map-dashboard", marker: "Command map dashboard" },
  ]

  for (const view of mapViews) {
    test(`renders the ${view.path} surface`, async ({ page }) => {
      //1.- Authenticate and seed the dashboard session for the spatial surfaces.
      await authenticate(page)

      //2.- Navigate to the requested page and confirm the localized headline is visible.
      await page.goto(view.path)
      await expect(page.getByText(view.marker)).toBeVisible()
    })
  }
})
