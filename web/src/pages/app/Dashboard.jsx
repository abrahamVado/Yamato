export default function Dashboard() {
  const kpis = [
    { k: 'Active Users', v: '1,284' },
    { k: 'Teams', v: '12' },
    { k: 'Modules On', v: '7' },
    { k: 'Errors (24h)', v: '0' },
  ]
  return (
    <div>
      <div className="app-header"><h2>Dashboard</h2></div>
      <div className="kpis">
        {kpis.map(x => (
          <div key={x.k} className="card">
            <div style={{fontSize:12, color:'var(--muted)'}}>{x.k}</div>
            <div style={{fontSize:24, fontWeight:700}}>{x.v}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:16}} className="card">
        <strong>Welcome</strong>
        <p>Use the sidebar to manage users, teams, modules and config.</p>
      </div>
    </div>
  )
}
