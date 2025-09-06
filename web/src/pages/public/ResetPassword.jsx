import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { bus, TOPIC } from '../../lib/bus'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [params] = useSearchParams()
  const onSubmit = (e) => {
    e.preventDefault()
    const token = params.get('token') || ''
    const email = params.get('email') || ''
    bus.emit(TOPIC.AUTH_RESET_REQ, { token, email, password })
  }
  return (
    <div className="container">
      <h2>Reset password</h2>
      <form onSubmit={onSubmit}>
        <div className="row">
          <label>New password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button className="btn" type="submit">Update password</button>
      </form>
    </div>
  )
}
