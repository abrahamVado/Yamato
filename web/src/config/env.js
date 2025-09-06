export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  TENANCY_MODE: import.meta.env.VITE_TENANCY_MODE || 'subdomain',
  DEFAULT_TENANT: import.meta.env.VITE_DEFAULT_TENANT || '',
  FLAGS_TTL_MS: Number(import.meta.env.VITE_PUBLIC_FLAGS_TTL_MS || 300000),
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Yamato',
}
