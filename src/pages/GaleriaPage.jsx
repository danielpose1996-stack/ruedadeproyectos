function GalleryItem({ icon, caption, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl aspect-square bg-white border border-slate-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <div className="absolute inset-0 flex items-center justify-center">
        <i className={`fa-solid ${icon} text-5xl text-slate-100 group-hover:text-primary-200 group-hover:scale-110 transition-all duration-500`}></i>
      </div>
      <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <div className="bg-white/95 backdrop-blur-sm border border-slate-100 p-3.5 rounded-xl shadow-card">
          <p className="section-label text-primary mb-0.5">Galería</p>
          <h4 className="text-sm font-semibold text-slate-700 leading-tight">{caption}</h4>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-800/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

export default function GaleriaPage() {
  const editions = [
    {
      label: 'Edición 2026-1',
      items: [
        { icon: 'fa-code', caption: 'Stand Innovación Software' },
        { icon: 'fa-microchip', caption: 'Prototipo IoT' },
        { icon: 'fa-users', caption: 'Equipos Destacados' },
        { icon: 'fa-chalkboard-user', caption: 'Sustentación' },
      ]
    },
    {
      label: 'Edición 2025-2',
      items: [
        { icon: 'fa-robot', caption: 'Competencia de Robótica' },
        { icon: 'fa-mobile-screen', caption: 'Apps Móviles' },
        { icon: 'fa-medal', caption: 'Gala de Premiación' },
      ]
    },
    {
      label: 'Edición 2025-1',
      items: [
        { icon: 'fa-server', caption: 'Infraestructura Data Center' },
        { icon: 'fa-magnifying-glass-chart', caption: 'Workshop de Análisis' },
      ]
    },
  ]

  return (
    <div className="max-w-6xl mx-auto py-12 px-5">
      <div className="text-center mb-14 space-y-3">
        <p className="section-label text-primary">Memoria Visual</p>
        <h1 className="text-heading text-slate-800">Galería de Proyectos</h1>
        <p className="text-base text-slate-400 max-w-lg mx-auto">Recuerdos de la innovación y creatividad en las ediciones pasadas.</p>
      </div>

      {editions.map((ed, i) => (
        <section key={i} className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="badge bg-slate-800 text-white">{ed.label}</span>
            <div className="h-px flex-grow bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {ed.items.map((item, j) => (
              <GalleryItem key={j} {...item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
