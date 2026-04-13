import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function ResultsPage() {
  const [year, setYear] = useState('2026')
  const [semester, setSemester] = useState('1')
  const [category, setCategory] = useState('Desarrollo')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadRankings() }, [])

  async function loadRankings() {
    setLoading(true)
    setError(null)
    try {
      const { data: proyectos, error: pErr } = await supabase
        .from('proyectos')
        .select(`id, nombre, categoria, semestre, anio, estado, evaluaciones ( puntaje_final ), proyecto_estudiantes ( perfiles ( nombre ) )`)
        .eq('estado', 'Evaluado').eq('anio', year).eq('semestre', semester).eq('categoria', category)
      if (pErr) throw pErr

      const ranked = proyectos.map(p => {
        let avgScore = 0
        if (p.evaluaciones && p.evaluaciones.length > 0) {
          const total = p.evaluaciones.reduce((acc, c) => acc + parseFloat(c.puntaje_final || 0), 0)
          avgScore = parseFloat((total / p.evaluaciones.length).toFixed(1))
        }
        const students = p.proyecto_estudiantes?.length > 0
          ? p.proyecto_estudiantes.map(pe => pe.perfiles?.nombre).join(', ')
          : 'Anónimo'
        return { id: p.id, nombre: p.nombre, students, score: avgScore }
      })
      ranked.sort((a, b) => b.score - a.score)
      setProjects(ranked.slice(0, 5))
    } catch (e) {
      console.error('loadRankings Error:', e)
      setError('No se pudo recuperar el ranking. Inténtelo más tarde.')
    } finally { setLoading(false) }
  }

  const rankColors = [
    'bg-amber-400 text-white',
    'bg-slate-300 text-white',
    'bg-amber-700 text-white',
    'bg-slate-100 text-slate-500',
    'bg-slate-100 text-slate-500',
  ]

  return (
    <div className="max-w-5xl mx-auto py-12 px-5">
      <div className="text-center mb-12 space-y-3">
        <p className="section-label text-primary">Ranking académico</p>
        <h1 className="text-heading text-slate-800">Resultados Históricos</h1>
        <p className="text-base text-slate-400 max-w-lg mx-auto">Consulta el ranking de los mejores proyectos por año, semestre y categoría.</p>
      </div>

      {/* Filters */}
      <div className="card-base shadow-card p-6 flex flex-wrap gap-5 items-end mb-10">
        <div className="flex-1 min-w-[160px]">
          <label className="section-label block mb-1.5 ml-0.5">Año</label>
          <select value={year} onChange={e => setYear(e.target.value)} className="select-base">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="section-label block mb-1.5 ml-0.5">Semestre</label>
          <select value={semester} onChange={e => setSemester(e.target.value)} className="select-base">
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="section-label block mb-1.5 ml-0.5">Categoría</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="select-base">
            <option value="Desarrollo">Desarrollo</option>
            <option value="Propuesta">Propuesta</option>
            <option value="Aplicación">Aplicación</option>
          </select>
        </div>
        <button onClick={loadRankings} className="btn-primary !px-6 !py-3">
          <i className="fa-solid fa-magnifying-glass text-xs opacity-60"></i> Buscar
        </button>
      </div>

      {/* Results */}
      {loading && <div className="card-base"><LoadingSpinner text="Cargando ranking..." /></div>}

      {error && (
        <div className="card-base p-10 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-status-danger text-xl mx-auto mb-3"><i className="fa-solid fa-triangle-exclamation"></i></div>
          <p className="text-sm font-semibold text-status-danger">{error}</p>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="card-base p-14 text-center">
          <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"><i className="fa-solid fa-ranking-star"></i></div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Sin resultados</h3>
          <p className="text-sm text-slate-400">No hay proyectos evaluados para <strong className="text-primary">{category}</strong> en {year}-{semester}.</p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="card-base shadow-card overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-lg"><i className="fa-solid fa-trophy"></i></div>
              <div>
                <h2 className="text-subheading text-slate-800">Top Proyectos</h2>
                <p className="section-label">{category} • {year}-{semester}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="table-header text-center w-20">#</th>
                  <th className="table-header">Proyecto</th>
                  <th className="table-header">Equipo</th>
                  <th className="table-header text-right">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map((p, i) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="table-cell text-center">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm mx-auto ${rankColors[i] || 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
                    </td>
                    <td className="table-cell"><p className="font-semibold text-slate-700">{p.nombre}</p></td>
                    <td className="table-cell text-slate-400 italic text-sm">{p.students}</td>
                    <td className="table-cell text-right">
                      <span className="inline-flex w-10 h-10 rounded-xl bg-primary-50 text-primary items-center justify-center font-bold text-sm">{p.score.toFixed(1)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
