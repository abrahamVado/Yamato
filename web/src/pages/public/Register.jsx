import { useState } from 'react'
import { bus, TOPIC } from '../../lib/bus'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!agree) return
    bus.emit(TOPIC.AUTH_REGISTER_REQ, { name, email, password })
  }

  return (
    <div className="container">
      <h2>Create account</h2>
      <form onSubmit={onSubmit}>
        <div className="row">
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="row">
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="row">
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <label><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} /> I agree to Terms</label>
        <div style={{marginTop:10}}><button className="btn" type="submit">Register</button></div>
      </form>
    </div>
  )
}
