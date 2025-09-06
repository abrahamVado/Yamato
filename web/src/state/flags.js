import { create } from 'zustand'

const defaults = {
  'public_pages.landing.enabled': true,
  'public_pages.login.enabled': true,
  'public_pages.register.enabled': true,
  'public_pages.email_verification.enabled': true,
  'public_pages.password_recovery.enabled': true,
}

export const useFlagsStore = create((set) => ({
  flags: defaults,
  lastLoaded: 0,
  setFlags: (flags, ts=Date.now()) => set({ flags, lastLoaded: ts }),
}))
