import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../hooks/useAuth'
import { escapeHTML } from '../../utils/helpers'
import { POSTULACION_ESTADO_CONFIG, CATEGORY_STYLES } from '../../utils/constants'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function EstudianteDashboard() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const studentName = profile?.nombre || 'Estudiante'

  const [activeTab, setActiveTab] = useState('evaluaciones')
  const [projects, setProjects] = useState([])
  const [postulaciones, setPostulaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [postLoading, setPostLoading] = useState(false)

  // Form state
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('Desarrollo')
  const [formDesc, setFormDesc] = useState('')
  const [formFile, setFormFile] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  useEffect(() => { loadStudentProjects() }, [])

  async function loadStudentProjects() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('proyecto_estudiantes')
        .select(`proyecto_id, proyectos ( id, nombre, categoria, semestre, anio, estado, evaluaciones ( puntaje_final ) )`)
        .eq('estudiante_id', profile.id)
      if (error) throw error
      setProjects(data || [])
    } catch (e) { console.error('loadStudentProjects Error:', e) }
    finally { setLoading(false) }
  }

  async function loadPostulaciones() {
    setPostLoading(true)
    try {
      const { data, error } = await supabase
        .from('postulaciones')
        .select('*')
        .eq('estudiante_id', profile.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setPostulaciones(data || [])
    } catch (e) { console.error('loadPostulaciones Error:', e) }
    finally { setPostLoading(false) }
  }

  function switchTab(tab) {
    setActiveTab(tab)
    if (tab === 'historial') loadPostulaciones()
  }

  async function handlePostular(e) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    if (!formName.trim() || !formDesc.trim()) { setFormError('El nombre y la descripción son obligatorios.'); return }
    setFormSubmitting(true)
    try {
      let archivoPath = null
      if (formFile) {
        const fileExt = formFile.name.split('.').pop()
        const fileName = `${profile.id}_${Date.now()}.${fileExt}`
        const { error: uploadErr } = await supabase.storage.from('postulaciones-docs').upload(fileName, formFile)
        if (uploadErr) throw uploadErr
        archivoPath = fileName
      }

      const { error: insertErr } = await supabase.from('postulaciones').insert([{
        estudiante_id: profile.id,
        nombre: escapeHTML(formName),
        categoria: escapeHTML(formCategory),
        descripcion: escapeHTML(formDesc),
        archivo_path: archivoPath,
        estado: 'Pendiente de revisión',
      }])
      if (insertErr) throw insertErr

      setFormSuccess('¡Tu propuesta ha sido enviada exitosamente!')
      setFormName('')
      setFormCategory('Desarrollo')
      setFormDesc('')
      setFormFile(null)
    } catch (e) {
      console.error('handlePostulacion Error:', e)
      setFormError('Error al enviar la postulación: ' + (e.message || ''))
    } finally { setFormSubmitting(false) }
  }

  function handleLogout() { logout(); navigate('/') }

  const tabs = [
    { id: 'evaluaciones', label: 'Mis Evaluaciones', icon: 'fa-chart-simple' },
    { id: 'postular', label: 'Postular Proyecto', icon: 'fa-paper-plane' },
    { id: 'historial', label: 'Historial', icon: 'fa-clock-rotate-left' },
    { id: 'perfil', label: 'Mi Perfil', icon: 'fa-user' },
  ]

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-surface border-r border-border-color p-6 flex flex-col gap-2 shrink-0">
        <nav className="flex flex-col gap-1 flex-grow">
          {tabs.map(t => (
            <button key={t.id} onClick={() => switchTab(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group text-left ${activeTab === t.id ? 'bg-primary-light text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}>
              <i className={`fa-solid ${t.icon} text-lg opacity-70 group-hover:scale-110 transition-transform`}></i> {t.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-border-color">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-status-danger hover:bg-red-50 transition-all group w-full text-left">
            <i className="fa-solid fa-arrow-right-from-bracket text-lg opacity-70 group-hover:translate-x-1 transition-transform"></i> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-grow p-6 md:p-10 bg-bg-base overflow-y-auto w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Hola, {studentName}</h1>
          <p className="text-slate-500 mt-1 font-medium">Portal Estudiantil Rueda de Proyectos SISINFO</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Mis Proyectos', value: projects.length, icon: 'fa-layer-group', colors: 'bg-primary-light text-primary' },
            { label: 'Evaluados', value: projects.filter(a => a.proyectos?.estado === 'Evaluado').length, icon: 'fa-check-double', colors: 'bg-emerald-50 text-emerald-600' },
            { label: 'Pendientes', value: projects.filter(a => a.proyectos?.estado === 'Pendiente').length, icon: 'fa-hourglass-half', colors: 'bg-amber-50 text-amber-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface p-6 rounded-3xl shadow-sm border border-border-color flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-2xl ${stat.colors} flex items-center justify-center text-2xl shadow-sm`}><i className={`fa-solid ${stat.icon}`}></i></div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TAB: Evaluaciones */}
        {activeTab === 'evaluaciones' && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-8 bg-primary rounded-full"></span> Mis Proyectos y Evaluaciones</h2>
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-50/50 border-b border-border-color">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Proyecto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Periodo</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Nota</th>
                </tr></thead>
                <tbody className="divide-y divide-border-color">
                  {loading ? <tr><td colSpan={5}><LoadingSpinner text="Cargando proyectos..." /></td></tr> :
                   projects.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No tienes proyectos registrados.</td></tr> :
                   projects.map(a => {
                    const p = a.proyectos
                    if (!p) return null
                    let avgScore = null
                    if (p.estado === 'Evaluado' && p.evaluaciones?.length > 0) {
                      const sum = p.evaluaciones.reduce((acc, c) => acc + parseFloat(c.puntaje_final || 0), 0)
                      avgScore = (sum / p.evaluaciones.length).toFixed(1)
                    }
                    const isEvaluated = p.estado === 'Evaluado'
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4"><p className="font-bold text-slate-800">{p.nombre}</p></td>
                        <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[p.categoria] || 'bg-slate-100 text-slate-600'}`}>{p.categoria}</span></td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{p.semestre}° / {p.anio}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`flex items-center gap-1.5 font-bold uppercase tracking-widest text-[10px] ${isEvaluated ? 'text-emerald-600' : 'text-amber-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isEvaluated ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span> {p.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {avgScore ? (
                            <span className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-black shadow-sm inline-flex">{avgScore}</span>
                          ) : (
                            <span className="text-xs text-slate-400 italic">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Postular */}
        {activeTab === 'postular' && (
          <div className="animate-fade-in max-w-3xl">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-8 bg-secondary rounded-full"></span> Postular Nuevo Proyecto</h2>
            <div className="bg-surface p-8 rounded-3xl shadow-premium border border-border-color">
              <form onSubmit={handlePostular} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Nombre del Proyecto</label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)} required placeholder="Ej: Sistema inteligente de monitoreo agrícola..."
                    className="w-full px-5 py-3 bg-bg-base border border-border-color rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Categoría</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-5 py-3 bg-bg-base border border-border-color rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none">
                    <option value="Desarrollo">Desarrollo de Software</option>
                    <option value="Propuesta">Propuesta de Investigación</option>
                    <option value="Aplicado">Proyecto Aplicado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Descripción</label>
                  <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={5} required placeholder="Describa los objetivos, alcance y justificación de su proyecto..."
                    className="w-full px-5 py-3 bg-bg-base border border-border-color rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Documento de Propuesta (Opcional)</label>
                  <input type="file" accept=".pdf,.docx,.doc" onChange={e => setFormFile(e.target.files?.[0] || null)}
                    className="w-full px-5 py-3 bg-bg-base border border-border-color rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary/10" />
                  <p className="text-xs text-slate-400 mt-1 ml-1">Formatos aceptados: PDF, DOCX, DOC</p>
                </div>

                {formError && <div className="bg-red-50 text-status-danger text-xs font-semibold p-4 rounded-xl border border-red-100"><i className="fa-solid fa-circle-exclamation mr-1"></i> {formError}</div>}
                {formSuccess && <div className="bg-emerald-50 text-status-success text-xs font-semibold p-4 rounded-xl border border-emerald-100"><i className="fa-solid fa-circle-check mr-1"></i> {formSuccess}</div>}

                <button type="submit" disabled={formSubmitting}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark shadow-xl shadow-primary/20 transform hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50">
                  {formSubmitting ? 'Enviando...' : 'Enviar Propuesta'} <i className="fa-solid fa-paper-plane ml-2 opacity-50"></i>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: Historial */}
        {activeTab === 'historial' && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-8 bg-amber-500 rounded-full"></span> Historial de Postulaciones</h2>
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-50/50 border-b border-border-color">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Proyecto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                </tr></thead>
                <tbody className="divide-y divide-border-color">
                  {postLoading ? <tr><td colSpan={4}><LoadingSpinner /></td></tr> :
                   postulaciones.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No has enviado ninguna postulación.</td></tr> :
                   postulaciones.map(p => {
                    const config = POSTULACION_ESTADO_CONFIG[p.estado] || { badge: 'bg-slate-100 text-slate-700', icon: 'fa-question' }
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4"><p className="font-bold text-slate-800">{p.nombre}</p></td>
                        <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[p.categoria] || 'bg-slate-100 text-slate-600'}`}>{p.categoria}</span></td>
                        <td className="px-6 py-4 text-sm text-slate-400 font-mono italic">{new Date(p.created_at).toLocaleDateString('es-CO')}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${config.badge}`}>
                            <i className={`fa-solid ${config.icon} text-xs`}></i> {p.estado}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Perfil */}
        {activeTab === 'perfil' && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-8 bg-slate-400 rounded-full"></span> Mi Perfil</h2>
            <div className="bg-surface p-8 max-w-2xl rounded-3xl shadow-premium border border-border-color">
              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                <div className="shrink-0 relative group">
                  <div className="w-32 h-32 rounded-3xl bg-emerald-50 flex items-center justify-center text-5xl font-black text-emerald-600 border-4 border-white shadow-lg overflow-hidden transition-transform group-hover:scale-105">{studentName.charAt(0)}</div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full shadow-sm"></div>
                </div>
                <div className="w-full space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Nombre Completo</label>
                    <div className="px-5 py-4 bg-bg-base rounded-2xl border border-border-color text-slate-700 font-bold text-lg shadow-sm">{studentName}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Rol</label>
                      <div className="px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 font-bold text-sm capitalize"><i className="fa-solid fa-graduation-cap mr-2 opacity-30 text-xs"></i> {profile?.rol}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">ID Usuario</label>
                      <div className="px-4 py-3 bg-slate-50 rounded-xl border border-border-color text-slate-500 font-mono text-[10px] truncate">#{profile?.id?.substring(0, 8)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
