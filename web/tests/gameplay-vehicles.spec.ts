import { test, expect } from "@playwright/test"
import { vehicleModels } from "../src/3dmodel/vehicles"

//1.- Ensure every 3D vehicle model is visible and interactive from the public gameplay view.
test.describe("Gameplay vehicle preview", () => {
  test("lists and previews the full fleet without authentication", async ({ page }) => {
    //2.- Navigate to the fleet preview page as a guest user.
    await page.goto("/gameplay/vehicles")

    //3.- Confirm the heading renders to establish the experience.
    await expect(page.getByRole("heading", { name: "Fleet preview bay" })).toBeVisible()

    //4.- Validate that each vehicle defined in the 3D catalogue is present on the screen.
    for (const vehicle of vehicleModels) {
      await expect(page.getByRole("button", { name: new RegExp(vehicle.name, "i") })).toBeVisible()
    }

    //5.- Select a specific vehicle and verify the detail inspector reflects its stats.
    const focusTarget = vehicleModels[1]
    await page.getByRole("button", { name: new RegExp(focusTarget.name, "i") }).click()
    await expect(page.getByText(focusTarget.description)).toBeVisible()
    await expect(page.getByText(focusTarget.stats.range)).toBeVisible()
  })
})
