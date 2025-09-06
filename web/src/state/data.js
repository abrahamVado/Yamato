import { create } from 'zustand'

const seedUsers = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@acme.test', role: 'admin' },
  { id: 2, name: 'Alan Turing', email: 'alan@acme.test', role: 'member' },
  { id: 3, name: 'Grace Hopper', email: 'grace@acme.test', role: 'member' },
]

const seedTeams = [
  { id: 1, name: 'Core', members: 3 },
  { id: 2, name: 'Growth', members: 5 },
]

const seedModules = [
  { id: 'auth', name: 'Auth', enabled: true },
  { id: 'billing', name: 'Billing', enabled: false },
  { id: 'analytics', name: 'Analytics', enabled: true },
]

export const useUsers = create((set) => ({
  items: seedUsers,
  upsert: (u) => set((s) => {
    const i = s.items.findIndex(x => x.id === u.id)
    if (i >= 0) {
      const next = [...s.items]; next[i] = { ...next[i], ...u }; return { items: next }
    }
    const id = Math.max(0, ...s.items.map(x=>x.id)) + 1
    return { items: [...s.items, { ...u, id }] }
  }),
  remove: (id) => set((s) => ({ items: s.items.filter(x => x.id !== id) })),
}))

export const useTeams = create((set) => ({
  items: seedTeams,
  upsert: (t) => set((s) => {
    const i = s.items.findIndex(x => x.id === t.id)
    if (i >= 0) { const next = [...s.items]; next[i] = { ...next[i], ...t }; return { items: next } }
    const id = Math.max(0, ...s.items.map(x=>x.id)) + 1
    return { items: [...s.items, { ...t, id }] }
  }),
  remove: (id) => set((s) => ({ items: s.items.filter(x => x.id !== id) })),
}))

export const useModules = create((set) => ({
  items: seedModules,
  toggle: (id, enabled) => set((s) => ({ items: s.items.map(m => m.id === id ? { ...m, enabled: enabled ?? !m.enabled } : m) }))
}))

export const useConfig = create((set) => ({
  values: {
    companyName: 'Acme Inc',
    supportEmail: 'support@acme.test',
    allowSignup: true,
  },
  setValue: (k, v) => set((s) => ({ values: { ...s.values, [k]: v } })),
}))
