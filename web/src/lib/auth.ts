import { apiGet, apiPost } from './api';

/**
 * Logs a user in by posting credentials to the `/login` endpoint.  Adjust
 * the endpoint path and payload shape to match your backend implementation.
 */
export async function login(email: string, password: string) {
  return apiPost('/login', { email, password });
}

/**
 * Logs the current user out by calling the `/logout` endpoint.  The
 * backend should clear any session or authentication cookies.
 */
export async function logout() {
  return apiPost('/logout', {});
}

/**
 * Fetches the current authenticated user.  Returns `null` if no user is
 * logged in.  Customize the endpoint path as needed.
 */
export async function getCurrentUser() {
  try {
    return await apiGet('/me');
  } catch (err) {
    return null;
  }
}