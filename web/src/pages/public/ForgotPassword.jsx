import { useState } from 'react'
import { bus, TOPIC } from '../../lib/bus'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const onSubmit = (e) => { e.preventDefault(); bus.emit(TOPIC.AUTH_FORGOT_REQ, { email }) }
  return (
    <div className="container">
      <h2>Forgot password</h2>
      <form onSubmit={onSubmit}>
        <div className="row">
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <button className="btn" type="submit">Send reset link</button>
      </form>
    </div>
  )
}
