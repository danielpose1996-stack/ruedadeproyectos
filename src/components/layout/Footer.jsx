import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-gear text-white text-xs"></i>
              </div>
              <span className="text-base font-bold text-white tracking-tight">RuedaPro UNIPAZ</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Plataforma para la gestión, evaluación y publicación de la Rueda de Proyectos de Ingeniería Informática.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="section-label text-slate-500 mb-4">Enlaces</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Inicio', icon: 'fa-home' },
                { to: '/resultados', label: 'Resultados', icon: 'fa-trophy' },
                { to: '/login/admin', label: 'Administración', icon: 'fa-lock' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200">
                    <i className={`fa-solid ${link.icon} text-[10px] text-slate-500`}></i> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-slate-700/50 rounded-card p-5 border border-slate-700">
            <h4 className="text-white text-sm font-semibold mb-2">¿Necesitas ayuda?</h4>
            <p className="text-slate-400 text-xs mb-4">Contacta con el soporte técnico de la facultad.</p>
            <a href="mailto:soporte@unipaz.edu.co" className="btn-primary text-xs w-full !py-2.5">
              <i className="fa-solid fa-envelope text-xs opacity-60"></i> Contactar Soporte
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>&copy; 2026 UNIPAZ — Ingeniería Informática</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
