import { bus, TOPIC } from '../lib/bus'
import { useAuthStore } from '../state/auth'

export function setupAuthEffects() {
  // Stub: set auth locally. Replace with API calls when backend is ready.
  bus.on(TOPIC.AUTH_LOGIN_REQ, async ({ email, password }) => {
    if (email && password) {
      useAuthStore.getState().setAuth({ status: 'authenticated', user: { id: 1, name: email.split('@')[0], email }, token: 'demo' })
      bus.emit(TOPIC.UI_TOAST, { type: 'success', title: 'Logged in' })
      bus.emit(TOPIC.UI_GOTO, { path: '/app' })
    } else {
      bus.emit(TOPIC.UI_TOAST, { type: 'error', title: 'Missing credentials' })
    }
  })

  bus.on(TOPIC.AUTH_LOGOUT, () => {
    useAuthStore.getState().logout()
    bus.emit(TOPIC.UI_GOTO, { path: '/' })
  })
}
