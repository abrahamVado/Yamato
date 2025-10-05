import { test, expect, type Page, type APIRequestContext } from "@playwright/test"

type MapView = {
  path: string
  marker: string
}

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

test.describe("Map experiences", () => {
  const mapViews: MapView[] = [
    { path: "/private/map", marker: "Geospatial operations map" },
    { path: "/private/map-reports", marker: "Spatial reports studio" },
    { path: "/private/map-dashboard", marker: "Command map dashboard" },
  ]

  for (const view of mapViews) {
    test(`renders the ${view.path} surface`, async ({ page, request }) => {
      //1.- Authenticate and seed the dashboard session for the spatial surfaces.
      await authenticate(page, request)

      //2.- Navigate to the requested page and confirm the localized headline is visible.
      await page.goto(view.path)
      await expect(page.getByText(view.marker)).toBeVisible()
    })
  }
})
