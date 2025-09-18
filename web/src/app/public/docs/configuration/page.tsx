// src/app/public/docs/configuration/page.tsx
"use client"
import * as React from "react"

export default function ConfigurationPage() {
  return (
    <>
      <h1>Configuration</h1>
      <p>Environment variables and app settings.</p>

      <h2>Environment</h2>
      <pre><code>cp .env.example .env
# edit DB_*, AUTH_*, and NEXT_PUBLIC_* as needed
</code></pre>
    </>
  )
}
