import { useModules } from '../../../state/data'

export default function ModulesList() {
  const { items, toggle } = useModules()
  return (
    <div>
      <div className="app-header"><h2>Modules</h2></div>
      <div className="card" style={{display:'grid', gap:12}}>
        {items.map(m => (
          <label key={m.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div><strong>{m.name}</strong></div>
            <input type="checkbox" checked={!!m.enabled} onChange={e=>toggle(m.id, e.target.checked)} />
          </label>
        ))}
      </div>
    </div>
  )
}
