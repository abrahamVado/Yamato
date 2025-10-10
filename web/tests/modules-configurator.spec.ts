import { test, expect } from "@playwright/test"
import type { Page } from "@playwright/test"
import { seedDashboardSession } from "./utils/auth"

//1.- Authenticate against the private API and seed session cookies/local storage for navigation.
async function authenticate(page: Page, { locale = "en" }: { locale?: "en" | "es" } = {}) {
  await seedDashboardSession(page)
  await page.addInitScript((value) => {
    window.localStorage.setItem("locale", value)
  }, locale)
}

test.describe("Modules configurator", () => {
  test("enumerates modules with icons in English", async ({ page }) => {
    //2.- Log in, visit the modules console, and confirm the enumerated rows render with metadata.
    await authenticate(page, { locale: "en" })
    await page.goto("/private/modules")

    await expect(page.getByRole("heading", { name: "Module control center" })).toBeVisible()

    const moduleRows = page.locator('[data-test="module-row"]')
    await expect(moduleRows).toHaveCount(4)
    await expect(moduleRows.nth(0).getByRole("heading", { name: "1. Identity graph" })).toBeVisible()
    await expect(moduleRows.nth(2).getByRole("heading", { name: "3. License guardian" })).toBeVisible()
    await expect(moduleRows.nth(2).getByRole("switch")).toHaveAttribute("aria-checked", "false")
    await expect(moduleRows.nth(0).getByRole("switch")).toHaveAttribute("aria-checked", "true")

    const backlogRows = page.locator('[data-test="backlog-row"]')
    await expect(backlogRows).toHaveCount(4)
    await expect(backlogRows.nth(0).getByText("1. Customer success")).toBeVisible()
    await expect(backlogRows.nth(1).getByRole("heading", { name: "Usage-based billing copilot" })).toBeVisible()
  })

  test("supports Spanish localization for the catalogue", async ({ page }) => {
    //3.- Switch the locale to Spanish and ensure translated module/backlog content renders with numbering.
    await authenticate(page, { locale: "es" })
    await page.goto("/private/modules")

    await expect(page.getByRole("heading", { name: "Centro de control de módulos" })).toBeVisible()

    const moduleRows = page.locator('[data-test="module-row"]')
    await expect(moduleRows.nth(0)).toContainText("Grafo de identidad")
    await expect(moduleRows.nth(1)).toContainText("Automatizaciones sin código")

    const backlogRows = page.locator('[data-test="backlog-row"]')
    await expect(backlogRows.nth(2).getByRole("heading", { name: "Asistente de onboarding con IA" })).toBeVisible()
    await expect(backlogRows.nth(3).getByText("Sala de prensa de salud del cliente")).toBeVisible()
  })
})
