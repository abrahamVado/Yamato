import { Outlet, Link } from 'react-router-dom'
import ToastHost from '../components/ToastHost'
import NetBanner from '../components/NetBanner'
import { ENV } from '../config/env'
import { useTenantStore } from '../state/tenant'
import YamatoLogo from '../../assets/images/yamato-logo.png' // <-- your logo

export default function PublicLayout() {
  const { name } = useTenantStore()

  return (
    <>
      <nav className="border-b border-gray-200">
        <div className="container grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3">
          {/* Brand (left) */}
          <strong className="justify-self-start">{name || ENV.APP_NAME}</strong>
          {/* Auth buttons (right) */}
          <div className="flex gap-3 justify-self-end">
            <Link className="btn" to="/login">Login</Link>
            <Link className="btn" to="/register">Register</Link>
          </div>
        </div>
      </nav>

      <Outlet />

      <footer className="border-t border-gray-200 text-gray-500">
        <div className="container py-3">
          <small>© {new Date().getFullYear()} Yamato Inc</small>
        </div>
      </footer>

      <ToastHost />
      <NetBanner />
    </>
  )
}
