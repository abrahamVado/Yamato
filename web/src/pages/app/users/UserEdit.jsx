import { useParams, useNavigate } from 'react-router-dom'
import { useUsers } from '../../../state/data'
import { useState, useEffect } from 'react'

export default function UserEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const isNew = id === 'new'
  const { items, upsert } = useUsers()
  const found = items.find(x => String(x.id) === id)
  const [name, setName] = useState(found?.name || '')
  const [email, setEmail] = useState(found?.email || '')
  const [role, setRole] = useState(found?.role || 'member')

  useEffect(()=>{
    if (!isNew && !found) nav('/app/users')
  }, [isNew, found, nav])

  const onSave = (e) => {
    e.preventDefault()
    upsert({ id: found?.id, name, email, role })
    nav('/app/users')
  }

  return (
    <div>
      <div className="app-header"><h2>{isNew ? 'New user' : 'Edit user'}</h2></div>
      <div className="card">
        <form onSubmit={onSave}>
          <div className="row"><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required/></div>
          <div className="row"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
          <div className="row">
            <label>Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="admin">admin</option>
              <option value="member">member</option>
            </select>
          </div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button className="btn" type="submit">Save</button>
            <button className="btn" type="button" onClick={()=>nav('/app/users')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
