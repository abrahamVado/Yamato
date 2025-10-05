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

test.describe("Settings communications", () => {
  test("shows WhatsApp and Email configuration panels", async ({ page, request }) => {
    //1.- Authenticate so the private settings area becomes available.
    await authenticate(page, request)

    //2.- Verify the new messaging sections and representative entries render.
    await page.goto("/private/settings")
    await expect(page.getByText("WhatsApp configuration")).toBeVisible()
    await expect(page.getByText("Incident bridge")).toBeVisible()
    await expect(page.getByText("Email configuration")).toBeVisible()
    await expect(page.getByText("Activation digest")).toBeVisible()
  })
})
