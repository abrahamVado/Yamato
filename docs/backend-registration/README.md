<!-- //1.- Capture the Laravel registration and verification contract consumed by the Next.js client. -->
# Laravel Registration & Email Verification Reference

The Yamato frontend relies on the following Laravel API endpoints when onboarding new operators. These
notes were captured from the Laravel application's `routes/api.php` and the associated auth
controllers so the client mirrors the real request and response payloads.

## 1. Registration endpoint

```php
//2.- Forward registration payloads from the SPA into the dedicated controller.
Route::post('/auth/register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);
```

`RegisteredUserController::store` validates and creates the user while dispatching the built-in
`Registered` event so Laravel's email verification notification is queued. The JSON schema is:

| Field | Rules | Notes |
| --- | --- | --- |
| `name` | `required|string|max:255` | Operator full name stored on the `users` table. |
| `email` | `required|email|unique:users,email` | Verification link is delivered to this address. |
| `password` | `required|string|min:8` | Must satisfy Laravel's default password complexity. |

> The backend also accepts an optional `password_confirmation` field when clients want a second input,
but Yamato's UI only collects a single password entry.

### Success payload

When validation passes the controller responds with HTTP `201` and returns the verification notice that
should be displayed to the operator while they visit their inbox:

```json
//3.- Laravel returns a structured message and notice so the SPA can render guidance inline.
{
  "message": "Registration complete.",
  "verification_notice": "We emailed a verification link to {email}."
}
```

Laravel's Sanctum middleware also primes the verification signature cookie in this response so the
follow-up `/email/verify/{id}/{hash}` call succeeds from the browser.

### Validation errors

Laravel returns HTTP `422` when validation fails with the familiar structure:

```json
//4.- Field-level errors are namespaced by the input key with localized copy from Laravel.
{
  "message": "The email field must be a valid email address.",
  "errors": {
    "email": [
      "The email field must be a valid email address."
    ]
  }
}
```

## 2. Email verification endpoint

```php
//5.- Signed verification URLs include the user id and hash plus query string signature metadata.
Route::get('/email/verify/{id}/{hash}', [\App\Http\Controllers\Auth\VerifyEmailController::class, '__invoke'])
    ->middleware(['signed'])
    ->name('verification.verify');
```

The frontend forwards the exact `id`, `hash`, `expires`, and `signature` values from the verification
link. Laravel responds with:

- `200` + `{ "message": "Email verified." }` when the signature is valid.
- `403` + `{ "message": "This verification link is invalid." }` when the hash/signature mismatch.
- `409` + `{ "message": "Email already verified." }` when the user was previously confirmed.

## 3. Resend verification notification

```php
//6.- Allow clients to trigger another notification when the initial email expires.
Route::post('/email/verification-notification', [\App\Http\Controllers\Auth\EmailVerificationNotificationController::class, 'store'])
    ->middleware(['throttle:6,1']);
```

The resend endpoint expects the email address of the pending user:

```json
//7.- Provide the target email so Laravel can look up the unverified user record.
{
  "email": "operator@example.com"
}
```

Successful calls return HTTP `202` with `{ "message": "Verification link sent." }`. When the address is
not found or already verified Laravel returns `404`/`409` with `message` explaining the condition. The
throttling middleware translates repeated requests into HTTP `429` and includes a `message` plus `retry_after` seconds.

## 4. Frontend integration checklist

1. //1.- Submit `name`, `email`, and `password` to `/auth/register` and surface `verification_notice`.
2. //2.- Redirect operators to the verification screen with the registered email in the query string.
3. //3.- Parse `id`, `hash`, `expires`, and `signature` from verification links and call `/email/verify/...`.
4. //4.- Offer a resend action that posts `{ email }` to `/email/verification-notification` and bubble up `message`.
