import { test, expect } from "@playwright/test"

const REGISTER_ENDPOINT = "**/auth/register"
const VERIFY_ENDPOINT = "**/email/verify/**"
const RESEND_ENDPOINT = "**/email/verification-notification"

test.describe("Registration and email verification", () => {
  test("forwards registration payloads and propagates verification notice", async ({ page }) => {
    //1.- Capture the registration payload so we can validate it matches Laravel's contract.
    let capturedPayload: Record<string, unknown> | undefined
    const verificationNotice = "We emailed a verification link to demo.user@example.com."
    await page.route(REGISTER_ENDPOINT, async (route) => {
      capturedPayload = route.request().postDataJSON() as Record<string, unknown>
      await route.fulfill({
        status: 201,
        body: JSON.stringify({
          message: "Registration complete.",
          verification_notice: verificationNotice,
        }),
        headers: { "content-type": "application/json" },
      })
    })

    //2.- Submit the registration form with a full name, email, and password.
    await page.goto("/public/register")
    await page.getByLabel("Full name").fill("Demo User")
    await page.getByLabel("Email").fill("demo.user@example.com")
    await page.getByLabel("Password").fill("super-secret")
    await page.getByRole("button", { name: "Create account" }).click()

    //3.- Confirm the SPA redirected to the verification screen with Laravel's notice.
    await page.waitForURL(/\/public\/verify-email/)
    await expect(page.getByText(verificationNotice)).toBeVisible()

    //4.- Assert the registration payload includes the exact fields Laravel expects.
    await expect.poll(() => capturedPayload).not.toBeUndefined()
    expect(capturedPayload).toMatchObject({
      name: "Demo User",
      email: "demo.user@example.com",
      password: "super-secret",
    })
  })

  test("confirms a verification link and displays the success state", async ({ page }) => {
    //1.- Stub the verification endpoint to simulate Laravel accepting the signature.
    let verifyCalled = false
    await page.route(VERIFY_ENDPOINT, async (route) => {
      verifyCalled = true
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ message: "Email verified." }),
        headers: { "content-type": "application/json" },
      })
    })

    //2.- Navigate with the verification parameters Laravel embeds in its email link.
    await page.goto(
      "/public/verify-email?id=123&hash=abc&expires=999999&signature=demo&email=demo.user@example.com",
    )

    //3.- Confirm the verification endpoint was hit and the success message is displayed.
    await expect.poll(() => verifyCalled).toBeTruthy()
    await expect(page.getByText("Email verified.")).toBeVisible()
  })

  test("surfaces verification failures and allows the notification to be resent", async ({ page }) => {
    //1.- Simulate Laravel rejecting the verification signature with a descriptive message.
    await page.route(VERIFY_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 403,
        body: JSON.stringify({ message: "This verification link is invalid." }),
        headers: { "content-type": "application/json" },
      })
    })

    //2.- Capture resend payloads so we can confirm the email address is forwarded correctly.
    let resendPayload: Record<string, unknown> | undefined
    await page.route(RESEND_ENDPOINT, async (route) => {
      resendPayload = route.request().postDataJSON() as Record<string, unknown>
      await route.fulfill({
        status: 202,
        body: JSON.stringify({ message: "Verification link sent." }),
        headers: { "content-type": "application/json" },
      })
    })

    //3.- Load the verification screen to trigger the failure state.
    await page.goto(
      "/public/verify-email?id=123&hash=def&signature=bad&email=demo.user@example.com",
    )

    //4.- Ensure the destructive alert surfaces Laravel's error message.
    await expect(page.getByText("We couldn't verify your email.")).toBeVisible()
    await expect(page.getByText("This verification link is invalid.")).toBeVisible()

    //5.- Resend the verification email and assert the backend receives the intended address.
    await page.getByLabel("Email").fill("demo.user@example.com")
    await page.getByRole("button", { name: "Resend email" }).click()
    await expect(page.getByText("Verification link sent.")).toBeVisible()
    await expect.poll(() => resendPayload).not.toBeUndefined()
    expect(resendPayload).toMatchObject({ email: "demo.user@example.com" })
  })
})
