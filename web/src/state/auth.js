import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  status: 'anonymous', // 'authenticated'
  user: null,
  token: null,
  setAuth: (patch) => set((s) => ({ ...s, ...patch })),
  logout: () => set({ status: 'anonymous', user: null, token: null }),
}))
