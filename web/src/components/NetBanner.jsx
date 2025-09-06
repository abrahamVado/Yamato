import { useUIStore } from '../state/ui'
export default function NetBanner() {
  const online = useUIStore(s => s.online)
  if (online) return null
  return <div className="offline-banner">You’re offline. Some actions are disabled.</div>
}
