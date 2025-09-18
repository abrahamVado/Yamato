// src/app/public/docs/installation/page.tsx
"use client"

import * as React from "react"

export default function InstallationPage() {
  return (
    <>
      <h1>Installation</h1>
      <p>Install dependencies and bootstrap your environment.</p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Node 18+</li>
        <li>PNPM/Yarn/NPM</li>
        <li>Database (e.g., Postgres)</li>
      </ul>

      <h2>Steps</h2>
      <pre><code>pnpm i
pnpm dev</code></pre>
    </>
  )
}
