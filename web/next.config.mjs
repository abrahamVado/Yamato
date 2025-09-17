/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/register",        destination: "/public/register" },
      { source: "/login",           destination: "/public/login" },
      { source: "/forgot-password", destination: "/public/forgot-password" },
      { source: "/verify-email",    destination: "/public/verify-email" },
      { source: "/docs",            destination: "/public/docs" },
    ]
  },
}
export default nextConfig
