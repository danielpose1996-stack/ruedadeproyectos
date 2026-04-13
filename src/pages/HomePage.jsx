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
      {/* Hero Section */}
      <section className="relative bg-white py-16 md:py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-light rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl opacity-40"></div>

        <div className="max-w-6xl mx-auto px-5 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-14">
            {/* Text */}
            <div className="flex-1 space-y-6 text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-primary-50 border border-primary-100 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">Ingeniería Informática</span>
              </div>

              <h1 className="text-display text-slate-800 animate-slide-up-delay-1">
                RuedaPro <span className="text-primary">UNIPAZ</span>
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed animate-slide-up-delay-2">
                Plataforma académica para la gestión, evaluación y proyección de la innovación tecnológica en la región.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2 animate-slide-up-delay-3">
                <button className="btn-primary !px-6 !py-3" onClick={() => navigate('/resultados')}>
                  <i className="fa-solid fa-trophy text-xs opacity-60"></i> Ver Resultados
                </button>
                <button className="btn-outline !px-6 !py-3" onClick={() => navigate('/login/estudiante')}>
                  Ingreso Estudiantes
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex-1 w-full max-w-md animate-zoom-in">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-100 via-primary-50 to-white rounded-3xl aspect-[4/3] flex items-center justify-center border border-primary-100/50 shadow-card overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
                  <i className="fa-solid fa-network-wired text-7xl text-primary/15 group-hover:text-primary/25 transition-colors duration-700"></i>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="bg-white/90 backdrop-blur-sm border border-slate-100 p-4 rounded-xl shadow-soft">
                      <p className="section-label text-primary mb-0.5">Campus Virtual</p>
                      <p className="text-sm font-semibold text-slate-700">Impulsando el Futuro Digital</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
