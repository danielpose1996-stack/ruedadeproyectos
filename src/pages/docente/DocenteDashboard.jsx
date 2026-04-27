import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../hooks/useAuth'
import { escapeHTML } from '../../utils/helpers'
import { CATEGORY_STYLES } from '../../utils/constants'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function DocenteDashboard() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const docenteName = profile?.nombre || 'Docente Evaluador'

  const [activeTab, setActiveTab] = useState('pendientes')
  const [assignments, setAssignments] = useState([])
  const [revisionData, setRevisionData] = useState([])
  const [loading, setLoading] = useState(true)
  const [revLoading, setRevLoading] = useState(false)

  // Modal revision state
  const [revModal, setRevModal] = useState(false)
  const [revPost, setRevPost] = useState(null)
  const [revObs, setRevObs] = useState('')
  const [revError, setRevError] = useState('')
  const [revSubmitting, setRevSubmitting] = useState(false)

  useEffect(() => { loadProjects() }, [])

  async function loadProjects() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('proyecto_evaluadores')
        .select(`proyecto_id, proyectos ( id, nombre, categoria, semestre, anio, estado, evaluaciones (evaluador_id, puntaje_final) )`)
        .eq('evaluador_id', profile.id)
      if (error) throw error
      setAssignments(data || [])
    } catch (e) { console.error('loadDocenteProjects Error:', e) }
    finally { setLoading(false) }
  }

  const pendientes = assignments.filter(a => a.proyectos && !a.proyectos.evaluaciones?.find(e => e.evaluador_id === profile.id))
  const enviadas = assignments.filter(a => a.proyectos && a.proyectos.evaluaciones?.find(e => e.evaluador_id === profile.id))

  async function loadRevision() {
    setRevLoading(true)
    try {
      const { data, error } = await supabase
        .from('postulaciones')
        .select(`*, estudiante:perfiles!postulaciones_estudiante_id_fkey (nombre)`)
        .eq('docente_revisor_id', profile.id)
        .eq('estado', 'En revisión')
        .order('created_at', { ascending: false })
      if (error) throw error
      setRevisionData(data || [])
    } catch (e) { console.error('loadDocenteRevision Error:', e) }
    finally { setRevLoading(false) }
  }

  function switchTab(tab) {
    setActiveTab(tab)
    if (tab === 'revision') loadRevision()
  }

  async function openRevModal(id) {
    setRevObs('')
    setRevError('')
    try {
      const { data, error } = await supabase.from('postulaciones').select(`*, estudiante:perfiles!postulaciones_estudiante_id_fkey (nombre)`).eq('id', id).single()
      if (error) throw error
      // Check for file
      if (data.archivo_path) {
        const { data: sd } = await supabase.storage.from('postulaciones-docs').createSignedUrl(data.archivo_path, 3600)
        data._signedUrl = sd?.signedUrl || null
      }
      setRevPost(data)
      setRevModal(true)
    } catch (e) { console.error(e) }
  }

  async function submitRevision(decision) {
    if (!revObs.trim()) { setRevError('La observación es obligatoria.'); return }
    setRevSubmitting(true)
    setRevError('')
    try {
      const updates = { estado: decision, observacion_docente: escapeHTML(revObs) }
      if (decision === 'Aprobado') {
        const now = new Date()
        const catMap = { 'Aplicado': 'Aplicación', 'Propuesta': 'Propuesta', 'Desarrollo': 'Desarrollo' }
        const { data: newProj, error: projErr } = await supabase.from('proyectos').insert([{
          nombre: revPost.nombre, categoria: catMap[revPost.categoria] || revPost.categoria,
          semestre: now.getMonth() < 6 ? 1 : 2, anio: now.getFullYear(), estado: 'Pendiente'
        }]).select().single()
        if (projErr) throw projErr
        if (revPost.estudiante_id && newProj) {
          await supabase.from('proyecto_estudiantes').insert([{ proyecto_id: newProj.id, estudiante_id: revPost.estudiante_id }])
        }
        updates.proyecto_id = newProj.id
      }
      const { error } = await supabase.from('postulaciones').update(updates).eq('id', revPost.id)
      if (error) throw error
      setRevModal(false)
      loadRevision()
    } catch (e) {
      console.error(e)
      setRevError('Error al guardar la revisión: ' + (e.message || ''))
    } finally { setRevSubmitting(false) }
  }

  function handleLogout() { logout(); navigate('/') }

  const tabs = [
    { id: 'pendientes', label: 'Asignados / Pendientes', icon: 'fa-clock-rotate-left' },
    { id: 'enviadas', label: 'Evaluaciones enviadas', icon: 'fa-check-double' },
    { id: 'revision', label: 'Proyectos para Revisión', icon: 'fa-magnifying-glass-chart' },
    { id: 'perfil', label: 'Mi perfil', icon: 'fa-user' },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-full md:w-60 bg-white border-r border-slate-100 p-4 flex flex-col gap-1 shrink-0">
        <nav className="flex flex-col gap-0.5 flex-grow">
          {tabs.map(t => (
            <button key={t.id} onClick={() => switchTab(t.id)}
              className={activeTab === t.id ? 'sidebar-link-active' : 'sidebar-link'}>
              <i className={`fa-solid ${t.icon} text-sm opacity-60`}></i> {t.label}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-100">
          <button onClick={handleLogout} className="sidebar-link text-status-danger hover:bg-red-50 hover:text-status-danger w-full">
            <i className="fa-solid fa-arrow-right-from-bracket text-sm opacity-60"></i> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-grow p-6 md:p-8 bg-bg-base overflow-y-auto w-full">
        <div className="mb-8">
          <h1 className="text-heading text-slate-800">Hola, Prof. {docenteName}</h1>
          <p className="text-sm text-slate-400 mt-1">Panel de Evaluación Rueda de Proyectos SISINFO</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Asignados', value: assignments.length, icon: 'fa-folder-open', colors: 'bg-primary-50 text-primary' },
            { label: 'Pendientes', value: pendientes.length, icon: 'fa-hourglass-half', colors: 'bg-amber-50 text-amber-600' },
            { label: 'Enviados', value: enviadas.length, icon: 'fa-check-to-slot', colors: 'bg-emerald-50 text-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="card-base p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${stat.colors} flex items-center justify-center text-lg`}><i className={`fa-solid ${stat.icon}`}></i></div>
              <div>
                <p className="section-label mb-0.5">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TAB: Pendientes */}
        {activeTab === 'pendientes' && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-8 bg-primary rounded-full"></span> Proyectos Pendientes de Evaluación</h2>
            <div className="card-base shadow-card overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="border-b border-slate-100">
                  <th className="table-header">Proyecto</th>
                  <th className="table-header">Categoría</th>
                  <th className="table-header">Periodo</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header text-right">Acción</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? <tr><td colSpan={5}><LoadingSpinner text="Cargando asignaciones..." /></td></tr> :
                   pendientes.length === 0 ? <tr><td colSpan={5} className="table-cell text-center text-slate-400 italic py-12">No tienes proyectos pendientes de evaluación.</td></tr> :
                   pendientes.map(a => {
                    const p = a.proyectos
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="table-cell"><p className="font-semibold text-slate-700 group-hover:text-primary transition-colors">{p.nombre}</p></td>
                        <td className="table-cell"><span className={`badge ${CATEGORY_STYLES[p.categoria] || 'bg-slate-100 text-slate-600'}`}>{p.categoria}</span></td>
                        <td className="table-cell text-slate-400">{p.semestre}° / {p.anio}</td>
                        <td className="table-cell"><span className="badge bg-amber-50 text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pendiente</span></td>
                        <td className="table-cell text-right">
                          <button onClick={() => navigate(`/evaluacion/${p.id}`)} className="btn-primary text-xs !px-4 !py-2">
                            Calificar <i className="fa-solid fa-angle-right ml-1 text-xs opacity-60"></i>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Enviadas */}
        {activeTab === 'enviadas' && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-8 bg-emerald-500 rounded-full"></span> Evaluaciones Enviadas</h2>
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-50/50 border-b border-border-color">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Proyecto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Periodo</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Resultado</th>
                </tr></thead>
                <tbody className="divide-y divide-border-color">
                  {enviadas.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Aún no has enviado ninguna evaluación.</td></tr> :
                   enviadas.map(a => {
                    const p = a.proyectos
                    const myEval = p.evaluaciones.find(e => e.evaluador_id === profile.id)
                    const score = parseFloat(myEval?.puntaje_final || 0).toFixed(1)
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4"><p className="font-bold text-slate-800">{p.nombre}</p></td>
                        <td className="px-6 py-4 text-sm"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[p.categoria] || 'bg-slate-100 text-slate-600'}`}>{p.categoria}</span></td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{p.semestre}° / {p.anio}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-3">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Enviado</span>
                            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black shadow-sm border border-emerald-100">{score}</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Revisión */}
        {activeTab === 'revision' && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-8 bg-blue-500 rounded-full"></span> Proyectos Asignados para Revisión</h2>
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-50/50 border-b border-border-color">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Proyecto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Estudiante</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acción</th>
                </tr></thead>
                <tbody className="divide-y divide-border-color">
                  {revLoading ? <tr><td colSpan={5}><LoadingSpinner /></td></tr> :
                   revisionData.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No tienes proyectos asignados para revisión.</td></tr> :
                   revisionData.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4"><p className="font-bold text-slate-800 group-hover:text-primary transition-colors">{p.nombre}</p></td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{p.estudiante?.nombre || '—'}</td>
                      <td className="px-6 py-4 text-sm"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[p.categoria] || 'bg-slate-100 text-slate-600'}`}>{p.categoria}</span></td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono italic">{new Date(p.created_at).toLocaleDateString('es-CO')}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openRevModal(p.id)} className="bg-primary text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5">
                          <i className="fa-solid fa-file-pen mr-1"></i> REVISAR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Perfil */}
        {activeTab === 'perfil' && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-8 bg-slate-400 rounded-full"></span> Mi Perfil</h2>
            <div className="card-base shadow-card p-6 max-w-lg">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl font-bold text-primary">{docenteName.charAt(0)}</div>
                </div>
                <div className="w-full space-y-4">
                  <div>
                    <label className="section-label block mb-1">Nombre Completo</label>
                    <div className="input-base !bg-slate-50 font-semibold">{docenteName}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="section-label block mb-1">Rol</label>
                      <div className="input-base !bg-primary-50 text-primary font-semibold text-sm capitalize"><i className="fa-solid fa-user-shield mr-1.5 opacity-40 text-xs"></i>{profile?.rol}</div>
                    </div>
                    <div>
                      <label className="section-label block mb-1">ID</label>
                      <div className="input-base !bg-slate-50 text-slate-400 font-mono text-xs truncate">#{profile?.id?.substring(0, 8)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Revision Modal */}
      {revModal && revPost && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex justify-center items-center p-4" onClick={() => setRevModal(false)}>
          <div className="bg-white rounded-modal w-full max-w-[580px] shadow-modal overflow-hidden animate-zoom-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-5 pb-4 flex justify-between items-center border-b border-slate-100 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary text-lg"><i className="fa-solid fa-file-signature"></i></div>
                <h3 className="text-lg font-bold text-slate-800">Revisar Proyecto</h3>
              </div>
              <button onClick={() => setRevModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-5 space-y-5">
              <div className="bg-slate-50 border border-slate-100 rounded-card p-5 space-y-3">
                <div>
                  <p className="section-label mb-1">Título del Proyecto</p>
                  <h4 className="text-lg font-semibold text-slate-800 leading-snug">{revPost.nombre}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-btn border border-slate-100">
                    <p className="section-label mb-0.5">Estudiante</p>
                    <p className="text-sm font-medium text-slate-700">{revPost.estudiante?.nombre || '—'}</p>
                  </div>
                  <div className="p-3 bg-white rounded-btn border border-slate-100">
                    <p className="section-label mb-0.5">Categoría</p>
                    <span className="badge bg-slate-50 text-slate-600 border border-slate-200">{revPost.categoria}</span>
                  </div>
                </div>
                {revPost._signedUrl && (
                  <a href={revPost._signedUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white border border-blue-100 rounded-btn hover:bg-blue-50 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><i className="fa-solid fa-file-word"></i></div>
                    <div className="flex-grow">
                      <p className="section-label text-blue-400">Documento Adjunto</p>
                      <p className="text-sm font-medium text-slate-700">Propuesta.docx</p>
                    </div>
                    <i className="fa-solid fa-download text-blue-300 text-xs"></i>
                  </a>
                )}
              </div>
              <div>
                <label className="section-label block mb-1.5">Retroalimentación</label>
                <textarea value={revObs} onChange={e => setRevObs(e.target.value)} rows={4} placeholder="Indica errores, mejoras o motivo de la aprobación..."
                  className="input-base !py-4 resize-none" />
              </div>
              {revError && <div className="bg-red-50 text-status-danger text-xs font-bold p-4 rounded-2xl border border-red-100"><i className="fa-solid fa-circle-exclamation mr-1"></i> {revError}</div>}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button onClick={() => submitRevision('No aprobado')} disabled={revSubmitting} className="btn-danger flex-1 !py-3">
                  <i className="fa-solid fa-circle-xmark text-xs opacity-60"></i> No aprobado
                </button>
                <button onClick={() => submitRevision('Aprobado')} disabled={revSubmitting} className="btn-primary flex-1 !py-3">
                  <i className="fa-solid fa-circle-check text-xs opacity-60"></i> {revSubmitting ? 'Procesando...' : 'Aprobado'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
