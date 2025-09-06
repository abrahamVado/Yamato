import { setTenantFromURL } from './lib/tenant'
import { setupFlagsEffects } from './effects/flags'
import { setupAuthEffects } from './effects/auth'
import { bus, TOPIC } from './lib/bus'
import { router } from './routes/router'
import { useUIStore } from './state/ui'

export function bootstrap() {
  setTenantFromURL()
  setupFlagsEffects()
  setupAuthEffects()

  // navigation
  bus.on(TOPIC.UI_GOTO, ({ path = '/', replace = false, state } = {}) => {
    router.navigate(path, { replace, state })
  })

  // toasts
  bus.on(TOPIC.UI_TOAST, (t) => {
    useUIStore.getState().pushToast({
      type: t?.type || 'info',
      title: t?.title || '',
      message: t?.message || '',
    })
  })

  // online/offline
  const emitNet = () => {
    const online = navigator.onLine
    bus.emit(TOPIC.NET_STATUS, { online })
    useUIStore.getState().setOnline(online)
  }
  window.addEventListener('online', emitNet)
  window.addEventListener('offline', emitNet)
  emitNet()

  // fetch flags on boot
  bus.emit(TOPIC.FLAGS_REQ)

  window.YAMATO_BUS = bus
}
