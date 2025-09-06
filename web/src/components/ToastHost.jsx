import { useEffect } from 'react'
import { useUIStore } from '../state/ui'

export default function ToastHost() {
  const toasts = useUIStore(s => s.toasts)
  const remove = useUIStore(s => s.removeToast)
  useEffect(() => {
    const timers = toasts.map(t => setTimeout(() => remove(t.id), t.timeout ?? 3500))
    return () => timers.forEach(clearTimeout)
  }, [toasts, remove])
  return (
    <div className="toast-host">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          {t.title && <strong>{t.title}</strong>}
          {t.message && <div className="msg">{t.message}</div>}
        </div>
      ))}
    </div>
  )
}
