import ky from 'ky'
import { ENV } from '../config/env'
import { useTenantStore } from '../state/tenant'

export const api = ky.create({
  prefixUrl: ENV.API_BASE_URL,
  hooks: {
    beforeRequest: [
      (req) => {
        const slug = useTenantStore.getState().slug
        if (slug) req.headers.set('X-Tenant', slug)
        req.headers.set('Accept', 'application/json')
        req.headers.set('Content-Type', 'application/json')
      }
    ]
  }
})
