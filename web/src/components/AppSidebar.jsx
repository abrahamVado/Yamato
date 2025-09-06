import { NavLink } from 'react-router-dom'
import { ENV } from '../config/env'
import { useTenantStore } from '../state/tenant'
import { bus, TOPIC } from '../lib/bus'

export default function AppSidebar() {
  const { name } = useTenantStore()
  return (
    <aside className="sidebar">
      <div className="logo">{name || ENV.APP_NAME}</div>
      <nav>
        <NavLink to="/app" end>Dashboard</NavLink>
        <NavLink to="/app/users">Users</NavLink>
        <NavLink to="/app/teams">Teams</NavLink>
        <NavLink to="/app/modules">Modules</NavLink>
        <NavLink to="/app/config">Config</NavLink>
      </nav>
      <div style={{marginTop:16}}>
        <button className="btn" onClick={()=>bus.emit(TOPIC.AUTH_LOGOUT)}>Logout</button>
      </div>
    </aside>
  )
}
