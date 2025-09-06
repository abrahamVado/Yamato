import Table from '../../../components/Table'
import { useTeams } from '../../../state/data'

export default function TeamsList() {
  const { items, upsert } = useTeams()
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Team' },
    { key: 'members', label: 'Members' },
  ]
  const addTeam = () => upsert({ name: `Team ${items.length+1}`, members: 0 })
  return (
    <div>
      <div className="app-header">
        <h2>Teams</h2>
        <button className="btn" onClick={addTeam}>New team</button>
      </div>
      <div className="card">
        <Table columns={columns} rows={items} />
      </div>
    </div>
  )
}
