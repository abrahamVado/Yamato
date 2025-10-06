import { test, expect } from "@playwright/test"

const base = "/gameplay"

test.describe("Gameplay surfaces", () => {
  test("world explorer is publicly reachable", async ({ page }) => {
    //1.- Navigate straight to the world explorer without authenticating.
    await page.goto(`${base}/world`)

    //2.- Verify the layout headline and a sample region are rendered.
    await expect(page.getByRole("heading", { name: "Gameplay laboratory" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Regions" })).toBeVisible()
    await expect(page.getByRole("button", { name: /Azure Steppe/i })).toBeVisible()

    //3.- Confirm selecting a region reveals the detailed description.
    await page.getByRole("button", { name: /Ember Hollows/i }).click()
    await expect(page.getByText(/geothermal energy lattice/i)).toBeVisible()
  })

  test("vehicle gallery lists available models", async ({ page }) => {
    //1.- Jump to the vehicle gallery and confirm it loads without authentication.
    await page.goto(`${base}/vehicles`)

    //2.- Ensure the gallery renders cards for each registered model.
    const cards = page.locator("article", { hasText: "Download model" })
    await expect(cards).toHaveCount(2)

    //3.- Verify that at least one model can be downloaded for offline inspection.
    const downloadLink = page.getByRole("link", { name: /Download model/i }).first()
    const href = await downloadLink.getAttribute("href")
    expect(href).toContain("/3dmodel/vehicles/sky-runner.gltf")
  })
})
