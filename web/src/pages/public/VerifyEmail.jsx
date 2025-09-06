import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { bus, TOPIC } from '../../lib/bus'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  useEffect(() => {
    const token = params.get('token') || ''
    const email = params.get('email') || ''
    if (token) bus.emit(TOPIC.AUTH_VERIFY_REQ, { token, email })
  }, [params])
  return (
    <div className="container">
      <h2>Verifying email…</h2>
      <p>Hang tight; this page will redirect when complete.</p>
    </div>
  )
}
