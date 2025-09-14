/**
 * Application constants and route definitions.  Centralizing these values
 * reduces the chance of typos in route strings and makes it easier to
 * update paths across the entire application.
 */

/** Base URL of the API.  Read from Vite environment variables. */
export const API_BASE_URL: string = (import.meta as any).env?.VITE_API_URL ?? '';

/** Named routes used throughout the app. */
export const ROUTES = {
  home: '/',
  about: '/about',
  pricing: '/pricing',
  dashboard: '/dashboard',
  documents: '/documents',
  settings: '/settings',
  profile: '/profile',
  login: '/login',
  register: '/register',
};