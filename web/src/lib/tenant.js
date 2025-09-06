import { ENV } from '../config/env'
import { useTenantStore } from '../state/tenant'

export function resolveTenantSlug(loc = window.location, mode = ENV.TENANCY_MODE, def = ENV.DEFAULT_TENANT) {
  if (mode === 'path') {
    const parts = loc.pathname.split('/').filter(Boolean)
    const idx = parts.indexOf('t')
    if (idx >= 0 && parts[idx+1]) return parts[idx+1]
    return def || ''
  } else {
    const host = loc.hostname
    const segs = host.split('.')
    if (segs.length > 2) return segs[0]
    return def || ''
  }
}

export function setTenantFromURL() {
  const slug = resolveTenantSlug()
  useTenantStore.getState().setTenant({ slug })
  return slug
}
