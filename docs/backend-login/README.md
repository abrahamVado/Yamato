<!-- //1.- Document the Laravel authentication entry point used by the Next.js client. -->
# Laravel Login Endpoint Reference

The Laravel API wires authentication through Sanctum using the route snippet below from
`routes/api.php`:

```php
//2.- Forward API login requests to the Sanctum session controller.
Route::post('/auth/login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
```

The paired controller (`app/Http/Controllers/Auth/AuthenticatedSessionController.php`) expects a JSON
payload containing the operator credentials:

```php
//3.- Validate the incoming credentials and return the Sanctum token response.
$request->validate([
    'email' => ['required', 'email'],
    'password' => ['required'],
    'remember' => ['sometimes', 'boolean'],
]);

if (! Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
    throw ValidationException::withMessages([
        'email' => ['These credentials do not match our records.'],
    ]);
}

$token = $request->user()->createToken('yamato-dashboard');

return response()->json([
    'token' => $token->plainTextToken,
]);
```

* //4.- The request body must include `email` and `password` while the optional `remember`
      boolean controls Sanctum's session lifetime.
* //5.- Successful responses serialize a `token` string while Sanctum also issues the
      session cookie used by guarded dashboard routes.
