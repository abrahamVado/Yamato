import { Buffer } from "node:buffer"
import type { Page } from "@playwright/test"

const SESSION_COOKIE_VALUE = Buffer.from(
  JSON.stringify({ id: "u1", name: "Yamato User", email: "admin@yamato.local", role: "admin" })
).toString("base64")

export const DEMO_BEARER_TOKEN = "demo-sanctum-token"

export async function seedDashboardSession(page: Page) {
  //1.- Inject the session cookie expected by the middleware guard so private routes unlock.
  await page.context().addCookies([
    {
      name: "yamato_session",
      value: SESSION_COOKIE_VALUE,
      domain: "127.0.0.1",
      path: "/",
    },
  ])

  //2.- Prime localStorage with the demo Sanctum token so authenticated API requests succeed.
  await page.addInitScript((token) => {
    window.localStorage.setItem("yamato.authToken", token)
  }, DEMO_BEARER_TOKEN)
}
