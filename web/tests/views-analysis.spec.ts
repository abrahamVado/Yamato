import { test, expect, type Page, type APIRequestContext } from "@playwright/test"

async function authenticate(page: Page, request: APIRequestContext) {
  const login = await request.post("/private/api/auth/signin", {
    data: { email: "admin@yamato.local", password: "admin" },
  })
  expect(login.status()).toBe(200)
  const cookieHeader = login.headers()["set-cookie"] ?? ""
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

  await page.addInitScript(() => {
    window.localStorage.setItem("yamato.authToken", "demo-sanctum-token")
  })
}

test.describe("Views analysis localization", () => {
  test("renders enumerated intelligence report in English", async ({ page, request }) => {
    //1.- Authenticate to reach the private analysis surface.
    await authenticate(page, request)

    //2.- Verify the English headings and enumerated entries render.
    await page.goto("/private/views-analysis")
    const main = page.getByRole("main")
    await expect(main.getByText("View intelligence report")).toBeVisible()
    await expect(main.getByText("Map dashboard").first()).toBeVisible()
    await expect(
      main.getByText("Statuses reflect the staging plan captured during the last platform review.")
    ).toBeVisible()
  })

  test("switches copy to Spanish when locale is persisted", async ({ page, request }) => {
    //1.- Persist the locale before hydration so the provider loads the Spanish dictionary.
    await page.addInitScript(() => {
      window.localStorage.setItem("locale", "es")
    })

    await authenticate(page, request)

    //2.- Confirm the headline and sample rows reflect the translated copy.
    await page.goto("/private/views-analysis")
    const main = page.getByRole("main")
    await expect(main.getByText("Informe de inteligencia de vistas")).toBeVisible()
    await expect(main.getByText("Panel de mapa").first()).toBeVisible()
  })
})
