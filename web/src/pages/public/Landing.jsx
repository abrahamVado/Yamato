import { Link } from 'react-router-dom'
import { useFlagsStore } from '../../state/flags'
import YamatoLogo from '../../../assets/images/yamato-logo.png'

export default function Landing() {
  const flags = useFlagsStore(s => s.flags)
  return (
    <div className="container hero">
      <h1>Welcome to Yamato</h1>
      <p>Secure, multi-tenant SaaS boilerplate.</p>
          {/* Centered logo */}
          <img
            src={YamatoLogo}
            alt="Yamato Inc logo"
            className="h-10 object-contain justify-self-center"
          />      
      <div style={{display:'flex', gap:12, marginTop:16}}>
        {flags['public_pages.login.enabled'] !== false && <Link className="btn" to="/login">Login</Link>}
        {flags['public_pages.register.enabled'] !== false && <Link className="btn" to="/register">Get started</Link>}
      </div>
    </div>
  )
}
