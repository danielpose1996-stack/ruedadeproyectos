import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { validateUnipazEmail } from '../utils/helpers'

export default function LoginPage() {
  const { role } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailHint, setEmailHint] = useState({ text: 'Solo correos @unipaz.edu.co', color: 'text-slate-400' })

  const titleMap = {
    docente: 'Ingreso Docente Evaluador',
    estudiante: 'Ingreso Portal Estudiantes',
    admin: 'Ingreso de Administrador',
  }
  const iconMap = {
    docente: 'fa-chalkboard-user',
    estudiante: 'fa-graduation-cap',
    admin: 'fa-shield-halved',
  }
  const dashMap = {
    docente: '/dashboard/docente',
    estudiante: '/dashboard/estudiante',
    admin: '/dashboard/admin',
  }

  const isValid = validateUnipazEmail(email)

  function handleEmailChange(value) {
    setEmail(value)
    if (value.length > 0) {
      if (validateUnipazEmail(value)) {
        setEmailHint({ text: 'Correo institucional válido', color: 'text-status-success' })
      } else {
        setEmailHint({ text: 'Debe usar @unipaz.edu.co', color: 'text-status-danger' })
      }
    } else {
      setEmailHint({ text: 'Solo correos @unipaz.edu.co', color: 'text-slate-400' })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) { setError('Correo @unipaz.edu.co requerido.'); return }
    setLoading(true)
    setError('')
    try {
      await login(email, password, role)
      navigate(dashMap[role] || '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] card-base shadow-card p-8 animate-zoom-in">
        {/* Icon */}
        <div className="w-14 h-14 bg-primary-50 text-primary rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto">
          <i className={`fa-solid ${iconMap[role] || 'fa-user-lock'}`}></i>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-1">{titleMap[role] || 'Ingreso'}</h2>
          <p className="text-sm text-slate-400">Ingrese sus credenciales institucionales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <i className="fa-solid fa-envelope text-xs"></i>
              </span>
              <input
                type="email"
                placeholder="usuario@unipaz.edu.co"
                required
                value={email}
                onChange={e => handleEmailChange(e.target.value)}
                className="input-base !pl-10"
              />
            </div>
            <p className={`mt-1.5 text-[11px] font-medium ml-0.5 ${emailHint.color}`}>
              {emailHint.text}
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <i className="fa-solid fa-key text-xs"></i>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-base !pl-10"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-status-danger text-xs font-medium py-3 px-4 rounded-btn text-center border border-red-100">
              <i className="fa-solid fa-circle-exclamation mr-1.5"></i>{error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="btn-primary w-full !py-3"
          >
            {loading ? 'Ingresando...' : 'Ingresar'} <i className="fa-solid fa-arrow-right-to-bracket text-xs opacity-60 ml-1"></i>
          </button>

          <div className="pt-4 text-center text-xs text-slate-300 border-t border-slate-100 mt-6">
            RuedaPro UNIPAZ • Sistema de Gestión de Proyectos
          </div>
        </form>
      </div>
    </div>
  )
}
