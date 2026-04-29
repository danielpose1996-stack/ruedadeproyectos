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
  const [loading, setLoading] = useState(true)

  // Form state for registering projects
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('Propuesta')
  const [formStudent, setFormStudent] = useState('')
  const [formFile, setFormFile] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [estudiantes, setEstudiantes] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)

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

  async function loadEstudiantes() {
    setStudentsLoading(true)
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('id, nombre')
        .eq('rol', 'estudiante')
        .order('nombre')
      if (error) throw error
      setEstudiantes(data || [])
    } catch (e) { console.error('loadEstudiantes Error:', e) }
    finally { setStudentsLoading(false) }
  }

  function switchTab(tab) {
    setActiveTab(tab)
    if (tab === 'registrar') loadEstudiantes()
  }

  async function handleRegisterProject(e) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    if (!formName.trim()) { setFormError('El título del proyecto es obligatorio.'); return }
    if (!formStudent) { setFormError('Debe seleccionar un estudiante líder.'); return }
    if (!formFile) { setFormError('Debe adjuntar la ficha de inscripción (.docx o .pdf).'); return }
    if (formFile.size > 15 * 1024 * 1024) { setFormError('El archivo no debe superar los 15 MB.'); return }
    setFormSubmitting(true)
    try {
      // Upload ficha de inscripción
      const fileExt = formFile.name.split('.').pop()
      const fileName = `${Date.now()}_${profile.id}.${fileExt}`
      const { error: uploadErr } = await supabase.storage.from('fichas-inscripcion').upload(fileName, formFile)
      if (uploadErr) throw uploadErr

      const now = new Date()
      const { data: projData, error: projErr } = await supabase.from('proyectos').insert([{
        nombre: escapeHTML(formName),
        categoria: formCategory,
        semestre: now.getMonth() < 6 ? 1 : 2,
        anio: now.getFullYear(),
        estado: 'Pendiente',
        ficha_path: fileName,
      }]).select().single()
      if (projErr) throw projErr

      // Vincular estudiante líder al proyecto
      const { error: studErr } = await supabase.from('proyecto_estudiantes').insert([{
        proyecto_id: projData.id,
        estudiante_id: formStudent,
      }])
      if (studErr) throw studErr

      setFormSuccess('¡Proyecto registrado exitosamente! Ahora el administrador podrá asignar los docentes calificadores.')
      setFormName('')
      setFormCategory('Propuesta')
      setFormStudent('')
      setFormFile(null)
    } catch (e) {
      console.error('handleRegisterProject Error:', e)
      setFormError('Error al registrar el proyecto: ' + (e.message || ''))
    } finally { setFormSubmitting(false) }
  }

  function handleLogout() { logout(); navigate('/') }

  const tabs = [
    { id: 'pendientes', label: 'Asignados / Pendientes', icon: 'fa-clock-rotate-left' },
    { id: 'enviadas', label: 'Evaluaciones enviadas', icon: 'fa-check-double' },
    { id: 'registrar', label: 'Registrar Proyecto', icon: 'fa-folder-plus' },
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

        {/* TAB: Registrar Proyecto */}
        {activeTab === 'registrar' && (
          <div className="animate-fade-in max-w-3xl">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-2 h-8 bg-blue-500 rounded-full"></span> Registrar Nuevo Proyecto</h2>
            <div className="bg-surface p-8 md:p-10 rounded-3xl shadow-premium border border-border-color relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary text-2xl shadow-sm">
                    <i className="fa-solid fa-file-circle-plus"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Formulario de Registro</h3>
                    <p className="text-sm text-slate-400 mt-0.5">Complete los datos del proyecto para registrarlo en el sistema</p>
                  </div>
                </div>

                <form onSubmit={handleRegisterProject} className="space-y-6">
                  {/* Título del Proyecto */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                      <i className="fa-solid fa-heading mr-2 text-xs text-primary opacity-60"></i>Título del Proyecto
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      required
                      placeholder="Ingrese el título completo del proyecto..."
                      className="w-full px-5 py-3.5 bg-bg-base border border-border-color rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                    />
                  </div>

                  {/* Tipo de Proyecto */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                      <i className="fa-solid fa-layer-group mr-2 text-xs text-primary opacity-60"></i>Tipo de Proyecto
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'Propuesta', label: 'Propuesta', icon: 'fa-lightbulb', color: 'amber' },
                        { value: 'Desarrollo', label: 'Desarrollo', icon: 'fa-code', color: 'blue' },
                        { value: 'Aplicación', label: 'Aplicación', icon: 'fa-rocket', color: 'emerald' },
                      ].map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormCategory(type.value)}
                          className={`p-4 rounded-xl border-2 text-center transition-all transform hover:-translate-y-0.5 ${
                            formCategory === type.value
                              ? `border-${type.color}-400 bg-${type.color}-50 shadow-lg shadow-${type.color}-100/50`
                              : 'border-slate-100 bg-bg-base hover:border-slate-200'
                          }`}
                        >
                          <i className={`fa-solid ${type.icon} text-xl mb-2 block ${
                            formCategory === type.value ? `text-${type.color}-500` : 'text-slate-300'
                          }`}></i>
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                            formCategory === type.value ? `text-${type.color}-700` : 'text-slate-400'
                          }`}>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estudiante Líder */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                      <i className="fa-solid fa-user-graduate mr-2 text-xs text-primary opacity-60"></i>Estudiante Líder del Proyecto
                    </label>
                    {studentsLoading ? (
                      <div className="px-5 py-3.5 bg-bg-base border border-border-color rounded-xl text-slate-400 text-sm italic">
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>Cargando estudiantes...
                      </div>
                    ) : (
                      <select
                        value={formStudent}
                        onChange={e => setFormStudent(e.target.value)}
                        required
                        className="w-full px-5 py-3.5 bg-bg-base border border-border-color rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none"
                      >
                        <option value="">-- Seleccionar estudiante --</option>
                        {estudiantes.map(est => (
                          <option key={est.id} value={est.id}>{est.nombre}</option>
                        ))}
                      </select>
                    )}
                    <p className="text-[10px] font-bold text-slate-400 mt-1.5 ml-1 uppercase tracking-widest">
                      <i className="fa-solid fa-circle-info mr-1 opacity-60"></i>Seleccione el estudiante responsable del proyecto
                    </p>
                  </div>

                  {/* Ficha de Inscripción */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                      <i className="fa-solid fa-file-word mr-2 text-xs text-primary opacity-60"></i>Ficha de Inscripción
                    </label>
                    <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      formFile ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-bg-base hover:border-primary/40'
                    }`}>
                      {formFile ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                              <i className="fa-solid fa-file-word"></i>
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-slate-700 truncate max-w-[250px]">{formFile.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{(formFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button type="button" onClick={() => setFormFile(null)} className="w-8 h-8 rounded-lg bg-red-50 text-status-danger hover:bg-status-danger hover:text-white transition-all flex items-center justify-center">
                            <i className="fa-solid fa-xmark text-xs"></i>
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-300 mb-2 block"></i>
                          <p className="text-sm font-semibold text-slate-500">Haz clic para seleccionar el archivo</p>
                          <p className="text-[10px] text-slate-400 mt-1">Formatos: DOCX, DOC, PDF — Máximo 15 MB</p>
                          <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={e => setFormFile(e.target.files?.[0] || null)} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  {formError && (
                    <div className="bg-red-50 text-status-danger text-xs font-semibold p-4 rounded-xl border border-red-100 flex items-center gap-2">
                      <i className="fa-solid fa-circle-exclamation"></i> {formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="bg-emerald-50 text-status-success text-sm font-semibold p-5 rounded-xl border border-emerald-100 flex items-start gap-3">
                      <i className="fa-solid fa-circle-check mt-0.5"></i>
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark shadow-xl shadow-primary/20 transform hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <i className={`fa-solid ${formSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'} opacity-60`}></i>
                    {formSubmitting ? 'Registrando proyecto...' : 'Registrar Proyecto'}
                  </button>
                </form>
              </div>
            </div>

            {/* Info card */}
            <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                <i className="fa-solid fa-info"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-800 mb-1">¿Qué sucede después?</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Una vez registrado, el proyecto aparecerá en el panel del administrador en <strong>Gestión de Proyectos</strong>, 
                  donde se asignarán los docentes calificadores correspondientes para iniciar el proceso de evaluación.
                </p>
              </div>
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
    </div>
  )
}
