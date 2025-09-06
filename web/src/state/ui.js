import { create } from 'zustand'
let id = 0

export const useUIStore = create((set) => ({
  toasts: [],
  pushToast: (t) => set((s) => ({ toasts: [...s.toasts, { id: ++id, ts: Date.now(), ...t }] })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
  online: true,
  setOnline: (online) => set({ online: !!online }),
}))
