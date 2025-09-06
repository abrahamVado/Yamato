import { useNavigate } from 'react-router-dom'
import { useUsers } from '../../../state/data'
import Table from '../../../components/Table'

export default function UsersList() {
  const { items, remove } = useUsers()
  const nav = useNavigate()

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'actions', label: '' , render: (_v, r) => <button className="btn" onClick={(e)=>{ e.stopPropagation(); remove(r.id) }}>Delete</button> },
  ]

  return (
    <div>
      <div className="app-header">
        <h2>Users</h2>
        <button className="btn" onClick={()=>nav('/app/users/new')}>New user</button>
      </div>
      <div className="card">
        <Table columns={columns} rows={items} onRowClick={(r)=>nav(`/app/users/${r.id}`)} />
      </div>
    </div>
  )
}
