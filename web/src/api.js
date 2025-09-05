import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
export async function ensureCsrf() {
  await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", { withCredentials: true });
}
