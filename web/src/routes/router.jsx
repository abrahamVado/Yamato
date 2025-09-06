import { createBrowserRouter, Navigate } from 'react-router-dom'
import PublicLayout from '../shell/PublicLayout'
import AppLayout from '../shell/AppLayout'
import Landing from '../pages/public/Landing'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import VerifyEmail from '../pages/public/VerifyEmail'
import ForgotPassword from '../pages/public/ForgotPassword'
import ResetPassword from '../pages/public/ResetPassword'
import Dashboard from '../pages/app/Dashboard'
import UsersList from '../pages/app/users/UsersList'
import UserEdit from '../pages/app/users/UserEdit'
import TeamsList from '../pages/app/teams/TeamsList'
import ModulesList from '../pages/app/modules/ModulesList'
import ConfigIndex from '../pages/app/config/ConfigIndex'
import DisabledView from '../components/DisabledView'
import { useFlagsStore } from '../state/flags'
import { useAuthStore } from '../state/auth'

function Guard({ flagKey, children }) {
  const enabled = useFlagsStore(s => s.flags?.[flagKey] !== false)
  if (!enabled) return <DisabledView flagKey={flagKey} />
  return children
}

function RequireAuth({ children }) {
  const status = useAuthStore(s => s.status)
  if (status !== 'authenticated') return <Navigate to="/login" replace />
  return children
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Guard flagKey="public_pages.login.enabled"><Login /></Guard> },
      { path: '/register', element: <Guard flagKey="public_pages.register.enabled"><Register /></Guard> },
      { path: '/verify-email', element: <Guard flagKey="public_pages.email_verification.enabled"><VerifyEmail /></Guard> },
      { path: '/forgot-password', element: <Guard flagKey="public_pages.password_recovery.enabled"><ForgotPassword /></Guard> },
      { path: '/reset-password', element: <Guard flagKey="public_pages.password_recovery.enabled"><ResetPassword /></Guard> },
    ]
  },
  {
    path: '/app',
    element: <RequireAuth><AppLayout /></RequireAuth>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <UsersList /> },
      { path: 'users/:id', element: <UserEdit /> },
      { path: 'teams', element: <TeamsList /> },
      { path: 'modules', element: <ModulesList /> },
      { path: 'config', element: <ConfigIndex /> },
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
])
