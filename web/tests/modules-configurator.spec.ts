import { test, expect } from "@playwright/test"

//1.- Authenticate against the private API and seed session cookies/local storage for navigation.
async function authenticate(
  page: import("@playwright/test").Page,
  request: import("@playwright/test").APIRequestContext,
  { locale = "en" }: { locale?: "en" | "es" } = {},
) {
  const response = await request.post("/private/api/auth/signin", {
    data: { email: "admin@yamato.local", password: "admin" },
  })
  expect(response.status()).toBe(200)
  const cookieHeader = response.headers()["set-cookie"] ?? ""
  const sessionMatch = cookieHeader.match(/yamato_session=([^;]+)/)
  expect(sessionMatch).toBeTruthy()
  const cookieValue = sessionMatch?.[1] ?? ""

  await page.context().addCookies([
    {
      name: "yamato_session",
      value: cookieValue,
      domain: "127.0.0.1",
      path: "/",
    },
  ])

  await page.addInitScript((payload) => {
    window.localStorage.setItem("yamato.authToken", payload.token)
    window.localStorage.setItem("locale", payload.locale)
  }, { token: "demo-sanctum-token", locale })
}

test.describe("Modules configurator", () => {
  test("enumerates modules with icons in English", async ({ page, request }) => {
    //2.- Log in, visit the modules console, and confirm the enumerated rows render with metadata.
    await authenticate(page, request, { locale: "en" })
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

  test("supports Spanish localization for the catalogue", async ({ page, request }) => {
    //3.- Switch the locale to Spanish and ensure translated module/backlog content renders with numbering.
    await authenticate(page, request, { locale: "es" })
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
