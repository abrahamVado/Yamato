import { useState } from 'react'
import { bus, TOPIC } from '../../lib/bus'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    bus.emit(TOPIC.AUTH_LOGIN_REQ, { email, password })
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div className="row">
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="row">
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button className="btn" type="submit">Sign in</button>
      </form>
    </div>
  )
}
