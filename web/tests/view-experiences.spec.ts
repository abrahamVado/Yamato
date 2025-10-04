import { test, expect } from "@playwright/test"

test.describe("Experience views", () => {
  test("login showcase renders marketing hero", async ({ page }) => {
    //2.- Visit the public login route and confirm the hero copy shipped with the showcase component.
    await page.goto("/public/login")
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible()
    await expect(page.getByText("Predictive Ops")).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
  })

  const privateViews = [
    { path: "/private/dashboard", marker: "Velocity overview" },
    {
      path: "/private/modules",
      marker: "Module control center",
      futureMarker: "Future module backlog",
    },
    { path: "/private/profile", marker: "Operator identity" },
    { path: "/private/roles", marker: "Role playbook" },
    { path: "/private/security", marker: "Security command center" },
    { path: "/private/settings", marker: "Organization preferences" },
    { path: "/private/teams", marker: "Teams cockpit" },
    { path: "/private/users", marker: "Operator directory" },
  ] as const

  for (const view of privateViews) {
    test(`renders the ${view.path} view`, async ({ page, request }) => {
      //3.- Authenticate via the sign-in API and seed the browser context cookie.
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

      //4.- Navigate to the private module and assert the new headline is visible.
      await page.goto(view.path)
      await expect(page.getByText(view.marker)).toBeVisible()
      if (view.futureMarker) {
        //5.- Confirm the curated backlog section renders so stakeholders can review upcoming ideas.
        await expect(page.getByText(view.futureMarker)).toBeVisible()
        await expect(page.getByText("Predictive churn radar")).toBeVisible()
      }
    })
  }
})
