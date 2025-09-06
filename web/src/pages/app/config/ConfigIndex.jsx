import { useConfig } from '../../../state/data'

export default function ConfigIndex() {
  const { values, setValue } = useConfig()
  return (
    <div>
      <div className="app-header"><h2>Config</h2></div>
      <div className="card">
        <div className="row">
          <label>Company name</label>
          <input value={values.companyName} onChange={e=>setValue('companyName', e.target.value)} />
        </div>
        <div className="row">
          <label>Support email</label>
          <input value={values.supportEmail} onChange={e=>setValue('supportEmail', e.target.value)} />
        </div>
        <div className="row">
          <label><input type="checkbox" checked={values.allowSignup} onChange={e=>setValue('allowSignup', e.target.checked)} /> Allow signups</label>
        </div>
        <div className="row">
          <small style={{color:'var(--muted)'}}>These values are in-memory for now; wire to backend later.</small>
        </div>
      </div>
    </div>
  )
}
