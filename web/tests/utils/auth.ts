import { Buffer } from "node:buffer"
import type { Page } from "@playwright/test"

export const DEMO_BEARER_TOKEN = "demo-sanctum-token"

export async function seedDashboardSession(page: Page) {
  const sessionValue = Buffer.from(
    JSON.stringify({ id: "u1", name: "Yamato User", email: "admin@yamato.local", role: "admin" })
  ).toString("base64")

  //1.- Mirror Laravel Sanctum's session cookies so middleware guards detect authenticated access.
  await page.context().addCookies([
    {
      name: "laravel_session",
      value: sessionValue,
      domain: "127.0.0.1",
      path: "/",
    },
    {
      name: "XSRF-TOKEN",
      value: "test-xsrf-token",
      domain: "127.0.0.1",
      path: "/",
    },
  ])

  //2.- Prime localStorage with the demo Sanctum token so authenticated API requests succeed.
  await page.addInitScript((token) => {
    window.localStorage.setItem("yamato.authToken", token)
  }, DEMO_BEARER_TOKEN)
}
