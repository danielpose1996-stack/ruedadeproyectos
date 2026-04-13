import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-circle-notch fa-spin text-4xl text-primary opacity-40 mb-4"></i>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(profile.rol)) {
    return <Navigate to="/" replace />
  }

  return children
}
