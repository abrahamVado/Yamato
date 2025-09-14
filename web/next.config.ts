import type { NextConfig } from 'next'

// Next.js configuration for Yamato Bootsland. This file is present for
// compatibility with Next.js tooling, should you decide to migrate from
// Vite to Next.js. It defines an experimental optimization for
// lucide-react icons and a rewrite rule for proxying API requests to
// an external backend via the NEXT_PUBLIC_API_URL environment variable.

const config: NextConfig = {
  experimental: {
    // Enable optimized package imports for lucide-react to ensure only
    // the icons you import are bundled.
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Proxy API routes to the backend defined in your environment.
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      },
    ]
  },
}

export default config