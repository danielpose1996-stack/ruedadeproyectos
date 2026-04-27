import { useNavigate } from 'react-router-dom'

function NewsCard({ icon, title, text, meta, accent }) {
  return (
    <div className="card-hover p-6 flex flex-col h-full group">
      <div className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center text-white text-lg mb-5 shadow-soft`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div className="flex-grow space-y-2">
        <p className="section-label">{meta}</p>
        <h3 className="text-lg font-semibold text-slate-800 leading-snug group-hover:text-primary transition-colors duration-200">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold text-primary/60 hover:text-primary transition-colors cursor-pointer">Leer más →</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      {/* Hero Section — Full Screen with Background Image */}
      <section
        className="relative min-h-screen flex items-center justify-center -mt-16 pt-16 overflow-hidden"
        style={{ backgroundImage: "url('/hero-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80 z-0"></div>

        {/* Subtle animated accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-pulse z-0" style={{ animationDelay: '1.5s' }}></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-semibold text-white/90 uppercase tracking-widest">Ingeniería de Sistemas e Informática</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] animate-slide-up-delay-1">
            Rueda de Proyectos
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-primary-200 to-emerald-300 mt-2">
              SISINFO
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto animate-slide-up-delay-2">
            Plataforma académica para la gestión, evaluación y proyección de la innovación tecnológica en la región.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-2 animate-slide-up-delay-3">
            <button
              className="group flex items-center gap-2.5 bg-primary hover:bg-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => navigate('/resultados')}
            >
              <i className="fa-solid fa-trophy text-sm opacity-70 group-hover:opacity-100 transition-opacity"></i>
              Ver Resultados
            </button>
            <button
              className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-xl border border-white/25 hover:border-white/40 hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => navigate('/login/estudiante')}
            >
              Ingreso Estudiantes
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="pt-8 animate-bounce">
            <i className="fa-solid fa-chevron-down text-white/30 text-lg"></i>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-bg-base">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
            <div>
              <p className="section-label mb-1">Actualidad</p>
              <h2 className="text-heading text-slate-800">Noticias del Evento</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-xs md:text-right">Últimas actualizaciones de la facultad.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NewsCard icon="fa-bullhorn" title="Apertura de inscripciones" text="Ya están abiertas las inscripciones para la próxima Rueda de Proyectos. Registra tu propuesta antes del cierre." meta="Hace 2 días" accent="bg-primary" />
            <NewsCard icon="fa-calendar-check" title="Cronograma actualizado" text="Consulta las fechas clave para la entrega de la documentación y la presentación de los proyectos." meta="Hace 1 semana" accent="bg-secondary" />
            <NewsCard icon="fa-ranking-star" title="Ganadores Semestre Anterior" text="Felicitamos a los proyectos destacados del último periodo académico por su innovación y calidad técnica." meta="Mes pasado" accent="bg-primary-700" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="bg-primary rounded-3xl px-8 py-14 md:px-16 md:py-20 text-center relative overflow-hidden shadow-elevated">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

            <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                Explora el Legado de la Rueda de Proyectos
              </h2>
              <p className="text-primary-200 text-base">
                Descubre los proyectos de mayor impacto y califica a los innovadores del mañana.
              </p>
              <button className="bg-white text-primary font-semibold px-7 py-3 rounded-btn shadow-btn hover:shadow-btn-hover hover:-translate-y-[1px] transition-all duration-200 active:translate-y-0 mt-2"
                onClick={() => navigate('/resultados')}>
                Explorar Ranking Histórico
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
