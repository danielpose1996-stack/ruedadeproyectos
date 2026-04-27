import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false) }, [location.pathname])

  function handleLogout() {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  function handleGoToPanel() {
    setDropdownOpen(false)
    if (!profile) return
    navigate(`/dashboard/${profile.rol}`)
  }

  const isHome = location.pathname === '/'
  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/galeria', label: 'Galería' },
    { to: '/resultados', label: 'Resultados' },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${isHome ? 'bg-black/20 backdrop-blur-md border-b border-white/10' : 'bg-white/95 backdrop-blur-md border-b border-slate-100'}`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-btn group-hover:shadow-btn-hover transition-shadow duration-200">
            <i className="fa-solid fa-gear text-white text-sm"></i>
          </div>
          <div className="leading-tight">
            <span className={`text-[15px] font-bold tracking-tight ${isHome ? 'text-white' : 'text-primary'}`}>Rueda de Proyectos</span>
            <span className={`text-[15px] font-medium ml-1 ${isHome ? 'text-white/70' : 'text-slate-400'}`}>SISINFO</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-btn text-sm font-medium transition-all duration-200 ${
                isActive(link.to)
                  ? isHome ? 'text-white bg-white/20' : 'text-primary bg-primary-50'
                  : isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-primary hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className={`w-px h-6 mx-3 ${isHome ? 'bg-white/20' : 'bg-slate-150'}`}></div>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login/docente" className={`text-xs font-medium px-3 py-2 rounded-btn transition-colors ${isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : 'btn-ghost'}`}>
                Docente
              </Link>
              <Link to="/login/estudiante" className={`text-xs !px-4 !py-2 ${isHome ? 'bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold rounded-btn border border-white/25 transition-colors' : 'btn-primary'}`}>
                Estudiante
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen) }}
                className="w-9 h-9 rounded-full bg-primary-100 text-primary font-semibold text-sm flex items-center justify-center hover:ring-2 hover:ring-primary/20 transition-all duration-200 uppercase"
              >
                {profile?.nombre?.charAt(0) || '?'}
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-card shadow-elevated border border-slate-100 p-2 z-50 animate-zoom-in">
                  <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{profile?.nombre}</p>
                    <span className="badge bg-primary-50 text-primary mt-1 capitalize">{profile?.rol}</span>
                  </div>
                  <button onClick={handleGoToPanel} className="w-full text-left px-3 py-2 rounded-btn text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary transition-colors">
                    <i className="fa-solid fa-columns mr-2 text-xs opacity-50"></i> Mi Panel
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-btn text-sm font-medium text-status-danger hover:bg-red-50 transition-colors">
                    <i className="fa-solid fa-arrow-right-from-bracket mr-2 text-xs opacity-50"></i> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden w-9 h-9 flex items-center justify-center rounded-btn transition-colors ${isHome ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-50'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-1 animate-slide-up">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`block px-4 py-2.5 rounded-btn text-sm font-medium ${isActive(link.to) ? 'text-primary bg-primary-50' : 'text-slate-600 hover:bg-slate-50'}`}>
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-100 mt-2 pt-2 space-y-1">
            {!user ? (
              <>
                <Link to="/login/docente" className="block px-4 py-2.5 rounded-btn text-sm font-medium text-slate-600 hover:bg-slate-50">Acceso Docente</Link>
                <Link to="/login/estudiante" className="block px-4 py-2.5 rounded-btn text-sm font-medium text-white bg-primary text-center">Acceso Estudiante</Link>
              </>
            ) : (
              <>
                <button onClick={handleGoToPanel} className="w-full text-left px-4 py-2.5 rounded-btn text-sm font-medium text-primary bg-primary-50">Mi Panel</button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-btn text-sm font-medium text-status-danger hover:bg-red-50">Cerrar Sesión</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
