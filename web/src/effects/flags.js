import { api } from '../lib/http'
import { bus, TOPIC } from '../lib/bus'
import { useFlagsStore } from '../state/flags'
import { useTenantStore } from '../state/tenant'
import { ENV } from '../config/env'

export function setupFlagsEffects() {
  bus.on(TOPIC.FLAGS_REQ, async () => {
    try {
      // In absence of backend, just simulate response (keep code ready for real API)
      let data
      if (!ENV.API_BASE_URL) {
        data = { flags: useFlagsStore.getState().flags, tenant: { name: 'Yamato Demo' } }
      } else {
        data = await api.get('api/public/flags').json()
      }
      useFlagsStore.getState().setFlags(data.flags)
      if (data.tenant?.name) {
        const slug = useTenantStore.getState().slug
        useTenantStore.getState().setTenant({ slug, name: data.tenant.name })
      }
      bus.emit(TOPIC.FLAGS_OK, { flags: data.flags })
    } catch (e) {
      bus.emit(TOPIC.FLAGS_ERR, { error: String(e) })
    }
  })
}
