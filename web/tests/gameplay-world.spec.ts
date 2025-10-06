import { test, expect } from "@playwright/test"

//1.- Validate that the open world route is interactive without any authentication ceremony.
test.describe("Gameplay world explorer", () => {
  test("allows exploring the frontier with no login", async ({ page }) => {
    //2.- Navigate straight to the gameplay world route as an anonymous visitor.
    await page.goto("/gameplay/world")

    //3.- Confirm the hero heading renders so the experience is visible to the visitor.
    await expect(page.getByRole("heading", { name: "Open world explorer" })).toBeVisible()

    //4.- Interact with a biome tile and ensure the detail panel updates accordingly.
    await page.getByRole("button", { name: /Ember Expanse/ }).click()
    await expect(page.getByText("Volcanic plateaus riddled with thermal vents")).toBeVisible()

    //5.- Verify the accessibility copy that highlights the lack of login requirements.
    await expect(page.getByText("no login or character assignment", { exact: false })).toBeVisible()
  })
})
