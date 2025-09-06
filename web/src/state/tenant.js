import { create } from 'zustand'

export const useTenantStore = create((set) => ({
  slug: '',
  name: '',
  setTenant: ({ slug, name }) => set({ slug: slug ?? '', name: name ?? '' }),
}))
