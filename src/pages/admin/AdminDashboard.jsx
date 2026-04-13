import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../hooks/useAuth'
import { escapeHTML, validateUnipazEmail } from '../../utils/helpers'
import { CATEGORY_STYLES, ROLE_BADGE_STYLES } from '../../utils/constants'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ConfirmModal from '../../components/ui/ConfirmModal'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function AdminDashboard() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(false)

  // ─── USERS ────
  const [users, setUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('')
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [editUserId, setEditUserId] = useState(null)
  const [userForm, setUserForm] = useState({ nombre: '', email: '', password: '', rol: 'estudiante' })
  const [userError, setUserError] = useState('')
  const [userSubmitting, setUserSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null })
  const [deleteAllUsersConfirm, setDeleteAllUsersConfirm] = useState(false)

  // ─── PROJECTS ────
  const [projects, setProjects] = useState([])
  const [projSearch, setProjSearch] = useState('')
  const [projCatFilter, setProjCatFilter] = useState('')
  const [showCreateProj, setShowCreateProj] = useState(false)
  const [showEditProj, setShowEditProj] = useState(false)
  const [editProjId, setEditProjId] = useState(null)
  const [projForm, setProjForm] = useState({ nombre: '', categoria: 'Desarrollo', semestre: 1, anio: 2026, ev1: '', ev2: '', ev3: '', student: '' })
  const [projError, setProjError] = useState('')
  const [projSubmitting, setProjSubmitting] = useState(false)
  const [docentes, setDocentes] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [deleteAllProjectsConfirm, setDeleteAllProjectsConfirm] = useState(false)

  useEffect(() => { loadUsers() }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // USERS TAB
  // ═══════════════════════════════════════════════════════════════════════════
  async function loadUsers() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('perfiles').select('*').order('nombre')
      if (error) throw error
      setUsers(data || [])
    } catch (e) { console.error('loadUsers Error:', e) }
    finally { setLoading(false) }
  }

  const filteredUsers = users.filter(u => {
    const matchSearch = u.nombre.toLowerCase().includes(userSearch.toLowerCase())
    const matchRole = userRoleFilter ? u.rol === userRoleFilter : true
    return matchSearch && matchRole
  })

  async function handleCreateUser(e) {
    e.preventDefault()
    if (!validateUnipazEmail(userForm.email)) { setUserError('Correo debe ser @unipaz.edu.co'); return }
    setUserSubmitting(true)
    setUserError('')
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error('No hay sesión activa.')

      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin_manage_users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY },
        body: JSON.stringify({ action: 'createUser', nombre: escapeHTML(userForm.nombre), email: userForm.email, password: userForm.password, rol: userForm.rol })
      })
      const result = await response.json()
      if (!response.ok || result.error) throw new Error(result.error || `Error ${response.status}`)

      setShowCreateUser(false)
      setUserForm({ nombre: '', email: '', password: '', rol: 'estudiante' })
      loadUsers()
    } catch (err) {
      setUserError(err.message || 'Error al crear usuario.')
    } finally { setUserSubmitting(false) }
  }

  function openEditUser(userId) {
    const u = users.find(x => x.id === userId)
    if (!u) return
    setEditUserId(userId)
    setUserForm({ nombre: u.nombre, email: '', password: '', rol: u.rol })
    setUserError('')
    setShowEditUser(true)
  }

  async function handleEditUser(e) {
    e.preventDefault()
    if (userForm.email && !validateUnipazEmail(userForm.email)) { setUserError('Correo debe ser @unipaz.edu.co'); return }
    setUserSubmitting(true)
    setUserError('')
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error('No hay sesión activa.')

      const payload = { action: 'editUser', userId: editUserId, nombre: escapeHTML(userForm.nombre), rol: escapeHTML(userForm.rol) }
      if (userForm.email) payload.email = userForm.email
      if (userForm.password) payload.password = userForm.password

      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin_manage_users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (!response.ok || result.error) throw new Error(result.error || `Error ${response.status}`)

      setShowEditUser(false)
      loadUsers()
    } catch (err) {
      setUserError(err.message || 'Error al editar usuario.')
    } finally { setUserSubmitting(false) }
  }

  async function handleDeleteUser() {
    if (!deleteConfirm.id) return
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error('No hay sesión activa.')

      try { await fetch(`${SUPABASE_URL}/functions/v1/admin_manage_users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY },
        body: JSON.stringify({ action: 'deleteUser', userId: deleteConfirm.id })
      }); } catch (e) { console.warn("Auth deletion note:", e) }

      await supabase.from('perfiles').delete().eq('id', deleteConfirm.id)
      setDeleteConfirm({ show: false, id: null })
      loadUsers()
    } catch (err) {
      console.error('deleteUser Error:', err)
      alert('Error al eliminar usuario: ' + err.message)
      setDeleteConfirm({ show: false, id: null })
    }
  }

  async function handleDeleteAllUsers() {
    setDeleteAllUsersConfirm(false)
    setLoading(true)
    let eliminados = 0;
    let errores = 0;

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error('No hay sesión activa.')

      // Identificamos todos los usuarios excepto el admin principal en sesión
      const usersToDelete = users.filter(u => u.id !== profile.id)
      
      // Eliminamos iterativamente para no saturar la Edge Function (Prevenir error 429) y atrapar errores individuales
      for (const u of usersToDelete) {
        try {
          try { await fetch(`${SUPABASE_URL}/functions/v1/admin_manage_users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY },
            body: JSON.stringify({ action: 'deleteUser', userId: u.id })
          }); } catch (e) { console.warn("Auth deletion note:", e) }
          
          const { error: pErr } = await supabase.from('perfiles').delete().eq('id', u.id);
          if (pErr) throw pErr;

          eliminados++;
        } catch (subError) {
          console.error(`Fallo al eliminar a ${u.nombre}:`, subError);
          errores++;
        }
      }

      loadUsers()
      
      if (errores > 0) {
        alert(`Se eliminaron ${eliminados} usuarios, pero hubo errores con ${errores} de ellos. Es posible que tengan registros en otras tablas impidiendo el borrado.`);
      } else {
        alert('Se eliminaron correctamente todos los usuarios, conservando solo al administrador principal.');
      }
    } catch (err) {
      console.error('deleteAllUsers Error:', err)
      alert('Error crítico al realizar la eliminación masiva: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECTS TAB
  // ═══════════════════════════════════════════════════════════════════════════
  async function loadProjects() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select(`*, proyecto_evaluadores ( evaluador_id, perfiles (nombre) )`)
        .order('created_at', { ascending: false })
      if (error) throw error
      setProjects(data || [])
    } catch (e) { console.error('loadProjects Error:', e) }
    finally { setLoading(false) }
  }

  async function loadUsersForProjectModal() {
    const [docsRes, estsRes] = await Promise.all([
      supabase.from('perfiles').select('id, nombre').eq('rol', 'docente').order('nombre'),
      supabase.from('perfiles').select('id, nombre').eq('rol', 'estudiante').order('nombre')
    ])
    setDocentes(docsRes.data || [])
    setEstudiantes(estsRes.data || [])
  }

  const filteredProjects = projects.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(projSearch.toLowerCase())
    const matchCat = projCatFilter ? p.categoria === projCatFilter : true
    return matchSearch && matchCat
  })

  async function openCreateProj() {
    setProjForm({ nombre: '', categoria: 'Desarrollo', semestre: 1, anio: 2026, ev1: '', ev2: '', ev3: '', student: '' })
    setProjError('')
    await loadUsersForProjectModal()
    setShowCreateProj(true)
  }

  async function handleCreateProject(e) {
    e.preventDefault()
    const evalIds = [projForm.ev1, projForm.ev2, projForm.ev3].filter(v => v)
    if (evalIds.length === 0) { setProjError('Debe asignar al menos un evaluador.'); return }
    setProjSubmitting(true)
    setProjError('')
    try {
      const { data: projData, error: projErr } = await supabase.from('proyectos')
        .insert([{ nombre: escapeHTML(projForm.nombre), categoria: projForm.categoria, semestre: projForm.semestre, anio: projForm.anio, estado: 'Pendiente' }])
        .select().single()
      if (projErr) throw projErr

      const evalInserts = evalIds.map(id => ({ proyecto_id: projData.id, evaluador_id: id }))
      await supabase.from('proyecto_evaluadores').insert(evalInserts)

      if (projForm.student) {
        await supabase.from('proyecto_estudiantes').insert([{ proyecto_id: projData.id, estudiante_id: projForm.student }])
      }

      setShowCreateProj(false)
      loadProjects()
    } catch (e) {
      setProjError('Error al registrar proyecto: ' + (e.message || ''))
    } finally { setProjSubmitting(false) }
  }

  async function openEditProj(projectId) {
    const p = projects.find(x => x.id === projectId)
    if (!p) return
    setEditProjId(projectId)
    setProjError('')
    await loadUsersForProjectModal()

    // Load current evaluators
    const { data: evalData } = await supabase.from('proyecto_evaluadores').select('evaluador_id').eq('proyecto_id', projectId)
    const evalIds = (evalData || []).map(e => e.evaluador_id)
    // Load current student
    const { data: studData } = await supabase.from('proyecto_estudiantes').select('estudiante_id').eq('proyecto_id', projectId).maybeSingle()

    setProjForm({
      nombre: p.nombre, categoria: p.categoria, semestre: p.semestre, anio: p.anio,
      ev1: evalIds[0] || '', ev2: evalIds[1] || '', ev3: evalIds[2] || '',
      student: studData?.estudiante_id || ''
    })
    setShowEditProj(true)
  }

  async function handleEditProject(e) {
    e.preventDefault()
    setProjSubmitting(true)
    setProjError('')
    try {
      await supabase.from('proyectos').update({ nombre: escapeHTML(projForm.nombre), categoria: projForm.categoria, semestre: projForm.semestre, anio: projForm.anio }).eq('id', editProjId)

      await supabase.from('proyecto_evaluadores').delete().eq('proyecto_id', editProjId)
      const evalIds = [projForm.ev1, projForm.ev2, projForm.ev3].filter(v => v)
      if (evalIds.length > 0) {
        await supabase.from('proyecto_evaluadores').insert(evalIds.map(id => ({ proyecto_id: editProjId, evaluador_id: id })))
      }

      await supabase.from('proyecto_estudiantes').delete().eq('proyecto_id', editProjId)
      if (projForm.student) {
        await supabase.from('proyecto_estudiantes').insert([{ proyecto_id: editProjId, estudiante_id: projForm.student }])
      }

      setShowEditProj(false)
      loadProjects()
    } catch (e) {
      setProjError('Error: ' + (e.message || ''))
    } finally { setProjSubmitting(false) }
  }

  async function deleteProject(projectId) {
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return
    try {
      const { error } = await supabase.from('proyectos').delete().eq('id', projectId)
      if (error) throw error
      loadProjects()
    } catch (e) {
      alert('Error al eliminar: ' + e.message)
    }
  }

  async function handleDeleteAllProjects() {
    setDeleteAllProjectsConfirm(false)
    setLoading(true)
    try {
      const projectIds = projects.map(p => p.id)
      if (projectIds.length > 0) {
        const { error } = await supabase.from('proyectos').delete().in('id', projectIds)
        if (error) throw error
      }
      loadProjects()
      alert('Se eliminaron todos los proyectos correctamente.')
    } catch (err) {
      console.error('deleteAllProjects Error:', err)
      alert('Error al realizar la eliminación masiva: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function switchTab(tab) {
    setActiveTab(tab)
    if (tab === 'users') loadUsers()
    else if (tab === 'projects') loadProjects()
  }

  function handleLogout() { logout(); navigate('/') }

  const estadoStyles = {
    'Pendiente': 'bg-slate-100 text-slate-500 border-slate-200',
    'Evaluado': 'bg-primary/10 text-primary border-primary/20',
  }

  const selectedEvIds = [projForm.ev1, projForm.ev2, projForm.ev3]

  const tabs = [
    { id: 'users', label: 'Gestión de Usuarios', icon: 'fa-users-gear' },
    { id: 'projects', label: 'Gestión de Proyectos', icon: 'fa-diagram-project' }
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-surface border-r border-border-color p-6 flex flex-col gap-2 shrink-0">
        <div className="mb-6 px-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Panel Admin</p>
          <p className="text-lg font-bold text-slate-800 truncate">{profile?.nombre}</p>
        </div>
        <nav className="flex flex-col gap-1 flex-grow">
          {tabs.map(t => (
            <button key={t.id} onClick={() => switchTab(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group text-left ${activeTab === t.id ? 'bg-primary-light text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}>
              <i className={`fa-solid ${t.icon} text-lg opacity-70`}></i> {t.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-border-color">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-status-danger hover:bg-red-50 transition-all group w-full text-left">
            <i className="fa-solid fa-arrow-right-from-bracket text-lg opacity-70"></i> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-grow p-6 md:p-10 bg-bg-base overflow-y-auto w-full">
        {/* ─── USERS TAB ───────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><span className="w-2 h-8 bg-primary rounded-full"></span> Gestión de Usuarios</h2>
              <div className="flex gap-3">
                <button onClick={() => setDeleteAllUsersConfirm(true)}
                  className="bg-red-50 text-status-danger border border-red-100 text-xs font-bold px-5 py-3 rounded-xl hover:bg-status-danger hover:text-white transition-all shadow-sm">
                  <i className="fa-solid fa-trash-can mr-2"></i> Eliminar todos
                </button>
                <button onClick={() => { setUserForm({ nombre: '', email: '', password: '', rol: 'estudiante' }); setUserError(''); setShowCreateUser(true) }}
                  className="bg-primary text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">
                  <i className="fa-solid fa-user-plus mr-2"></i> Nuevo Usuario
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <input type="text" placeholder="Buscar por nombre..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                className="flex-grow min-w-[200px] px-4 py-3 bg-surface border border-border-color rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}
                className="px-4 py-3 bg-surface border border-border-color rounded-xl font-medium appearance-none min-w-[150px] focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Todos los roles</option>
                <option value="admin">Admin</option>
                <option value="docente">Docente</option>
                <option value="estudiante">Estudiante</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-50/50 border-b border-border-color">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nombre</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Rol</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Acciones</th>
                </tr></thead>
                <tbody className="divide-y divide-border-color">
                  {loading ? <tr><td colSpan={4}><LoadingSpinner /></td></tr> :
                   filteredUsers.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No se encontraron usuarios</td></tr> :
                   filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm uppercase">{u.nombre.charAt(0)}</div><p className="font-bold text-slate-800 group-hover:text-primary transition-colors">{u.nombre}</p></div></td>
                      <td className="px-6 py-4 text-center"><span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${ROLE_BADGE_STYLES[u.rol] || 'bg-slate-50 text-slate-600'}`}>{u.rol}</span></td>
                      <td className="px-6 py-4 text-center"><span className="text-[10px] font-mono text-slate-400">#{u.id.substring(0, 8)}</span></td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => openEditUser(u.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all" title="Editar"><i className="fa-solid fa-pen text-[10px]"></i></button>
                          {u.id !== profile.id && (
                            <button onClick={() => setDeleteConfirm({ show: true, id: u.id })} className="w-8 h-8 flex items-center justify-center rounded-lg bg-status-danger/5 text-status-danger hover:bg-status-danger hover:text-white transition-all" title="Eliminar"><i className="fa-solid fa-trash text-[10px]"></i></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── PROJECTS TAB ─────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <div className="animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><span className="w-2 h-8 bg-secondary rounded-full"></span> Gestión de Proyectos</h2>
              <div className="flex gap-3">
                <button onClick={() => setDeleteAllProjectsConfirm(true)}
                  className="bg-red-50 text-status-danger border border-red-100 text-xs font-bold px-5 py-3 rounded-xl hover:bg-status-danger hover:text-white transition-all shadow-sm">
                  <i className="fa-solid fa-trash-can mr-2"></i> Eliminar todos
                </button>
                <button onClick={openCreateProj} className="bg-primary text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">
                  <i className="fa-solid fa-plus mr-2"></i> Nuevo Proyecto
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <input type="text" placeholder="Buscar proyecto..." value={projSearch} onChange={e => setProjSearch(e.target.value)}
                className="flex-grow min-w-[200px] px-4 py-3 bg-surface border border-border-color rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              <select value={projCatFilter} onChange={e => setProjCatFilter(e.target.value)}
                className="px-4 py-3 bg-surface border border-border-color rounded-xl font-medium appearance-none min-w-[150px] focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">Todas las categorías</option>
                <option value="Desarrollo">Desarrollo</option>
                <option value="Propuesta">Propuesta</option>
                <option value="Aplicación">Aplicación</option>
              </select>
            </div>

            <div className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-50/50 border-b border-border-color">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Proyecto</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Categoría</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Periodo</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Evaluadores</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Estado</th>
                  <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Acciones</th>
                </tr></thead>
                <tbody className="divide-y divide-border-color">
                  {loading ? <tr><td colSpan={6}><LoadingSpinner /></td></tr> :
                   filteredProjects.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No se encontraron proyectos</td></tr> :
                   filteredProjects.map(p => {
                    const evalNames = (p.proyecto_evaluadores || []).filter(pe => pe.perfiles).map(pe => pe.perfiles.nombre)
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4"><p className="font-bold text-slate-800 truncate max-w-[200px] group-hover:text-primary transition-colors" title={p.nombre}>{p.nombre}</p></td>
                        <td className="px-4 py-4 text-center"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[p.categoria] || 'bg-slate-100 text-slate-600'}`}>{p.categoria}</span></td>
                        <td className="px-4 py-4 text-center text-sm font-medium text-slate-500">{p.semestre}° / {p.anio}</td>
                        <td className="px-4 py-4"><div className="flex flex-wrap gap-1 max-w-[180px]">
                          {evalNames.length === 0 ? <span className="text-[9px] italic text-slate-400">Sin asignar</span> :
                           evalNames.map((n, i) => <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-lg truncate max-w-[100px]">{n}</span>)}
                        </div></td>
                        <td className="px-4 py-4 text-center"><span className={`inline-flex items-center px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest ${estadoStyles[p.estado] || 'bg-slate-50 text-slate-400 border-slate-100'}`}>{p.estado}</span></td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => openEditProj(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all"><i className="fa-solid fa-pen text-[10px]"></i></button>
                            <button onClick={() => deleteProject(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-status-danger/5 text-status-danger hover:bg-status-danger hover:text-white transition-all"><i className="fa-solid fa-trash text-[10px]"></i></button>
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
      </main>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODALS ────────────────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {/* Create User Modal */}
      {showCreateUser && (
        <ModalShell title="Crear Nuevo Usuario" icon="fa-user-plus" onClose={() => setShowCreateUser(false)}>
          <form onSubmit={handleCreateUser} className="space-y-5">
            <InputField label="Nombre completo" value={userForm.nombre} onChange={v => setUserForm(f => ({...f, nombre: v}))} required />
            <InputField label="Correo institucional" type="email" value={userForm.email} onChange={v => setUserForm(f => ({...f, email: v}))} required hint="Solo @unipaz.edu.co" />
            <InputField label="Contraseña" type="password" value={userForm.password} onChange={v => setUserForm(f => ({...f, password: v}))} required />
            <SelectField label="Rol" value={userForm.rol} onChange={v => setUserForm(f => ({...f, rol: v}))} options={[{ v:'estudiante', l:'Estudiante' },{ v:'docente', l:'Docente' },{ v:'admin', l:'Administrador' }]} />
            {userError && <ErrorBox text={userError} />}
            <button type="submit" disabled={userSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all disabled:opacity-50">
              {userSubmitting ? 'Creando...' : 'Crear Usuario'}
            </button>
          </form>
        </ModalShell>
      )}

      {/* Edit User Modal */}
      {showEditUser && (
        <ModalShell title="Editar Usuario" icon="fa-user-pen" onClose={() => setShowEditUser(false)}>
          <form onSubmit={handleEditUser} className="space-y-5">
            <InputField label="Nombre completo" value={userForm.nombre} onChange={v => setUserForm(f => ({...f, nombre: v}))} required />
            <InputField label="Nuevo correo (dejar vacío para no cambiar)" type="email" value={userForm.email} onChange={v => setUserForm(f => ({...f, email: v}))} hint="Solo @unipaz.edu.co" />
            <InputField label="Nueva contraseña (dejar vacío para no cambiar)" type="password" value={userForm.password} onChange={v => setUserForm(f => ({...f, password: v}))} />
            <SelectField label="Rol" value={userForm.rol} onChange={v => setUserForm(f => ({...f, rol: v}))} options={[{ v:'estudiante', l:'Estudiante' },{ v:'docente', l:'Docente' },{ v:'admin', l:'Administrador' }]} />
            {userError && <ErrorBox text={userError} />}
            <button type="submit" disabled={userSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all disabled:opacity-50">
              {userSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </ModalShell>
      )}

      {/* Create/Edit Project Modal */}
      {(showCreateProj || showEditProj) && (
        <ModalShell title={showEditProj ? 'Editar Proyecto' : 'Registrar Nuevo Proyecto'} icon="fa-diagram-project" onClose={() => { setShowCreateProj(false); setShowEditProj(false) }}>
          <form onSubmit={showEditProj ? handleEditProject : handleCreateProject} className="space-y-5">
            <InputField label="Nombre del Proyecto" value={projForm.nombre} onChange={v => setProjForm(f => ({...f, nombre: v}))} required />
            <SelectField label="Categoría" value={projForm.categoria} onChange={v => setProjForm(f => ({...f, categoria: v}))} options={[{ v:'Desarrollo', l:'Desarrollo' },{ v:'Propuesta', l:'Propuesta' },{ v:'Aplicación', l:'Aplicación' }]} />
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Semestre" value={projForm.semestre} onChange={v => setProjForm(f => ({...f, semestre: parseInt(v)}))} options={[{ v:1, l:'1° Semestre' },{ v:2, l:'2° Semestre' }]} />
              <InputField label="Año" type="number" value={projForm.anio} onChange={v => setProjForm(f => ({...f, anio: parseInt(v)}))} required />
            </div>
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Evaluadores asignados</p>
              {[{ key: 'ev1', n: 1 }, { key: 'ev2', n: 2 }, { key: 'ev3', n: 3 }].map(e => (
                <SelectField key={e.key} label={`Evaluador ${e.n}`} value={projForm[e.key]} onChange={v => setProjForm(f => ({...f, [e.key]: v}))}
                  options={[{ v: '', l: '-- Sin asignar --' }, ...docentes.map(d => ({ v: d.id, l: d.nombre, disabled: selectedEvIds.filter(id => id && id !== projForm[e.key]).includes(d.id) }))]} />
              ))}
            </div>
            <SelectField label="Estudiante" value={projForm.student} onChange={v => setProjForm(f => ({...f, student: v}))}
              options={[{ v: '', l: '-- Sin asignar --' }, ...estudiantes.map(s => ({ v: s.id, l: s.nombre }))]} />
            {projError && <ErrorBox text={projError} />}
            <button type="submit" disabled={projSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all disabled:opacity-50">
              {projSubmitting ? 'Guardando...' : (showEditProj ? 'Guardar Cambios' : 'Registrar Proyecto')}
            </button>
          </form>
        </ModalShell>
      )}

      {/* Delete User Confirm */}
      <ConfirmModal isOpen={deleteConfirm.show} onClose={() => setDeleteConfirm({ show: false, id: null })} onConfirm={handleDeleteUser}
        title="Eliminar Usuario" message="¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer y se perderán todos los datos asociados."
        confirmText="Sí, eliminar" cancelText="Cancelar" />

      {/* Delete All Users Confirm */}
      <ConfirmModal isOpen={deleteAllUsersConfirm} onClose={() => setDeleteAllUsersConfirm(false)} onConfirm={handleDeleteAllUsers}
        title="Eliminar Todos los Usuarios" message="¿Estás seguro de eliminar todos los usuarios? Esta acción conservará únicamente al administrador principal actual y no se puede deshacer."
        confirmText="Sí, eliminar todos" cancelText="Cancelar" loading={loading} />

      {/* Delete All Projects Confirm */}
      <ConfirmModal isOpen={deleteAllProjectsConfirm} onClose={() => setDeleteAllProjectsConfirm(false)} onConfirm={handleDeleteAllProjects}
        title="Eliminar Todos los Proyectos" message="¿Estás seguro de eliminar TODOS los proyectos? Esta acción eliminará registros y evaluaciones permanentemente, y no se puede deshacer."
        confirmText="Sí, eliminar todos" cancelText="Cancelar" loading={loading} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// REUSABLE FORM HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function ModalShell({ title, icon, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-[32px] w-full max-w-[550px] shadow-2xl border border-white/20 overflow-hidden animate-zoom-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-surface p-6 pb-4 flex items-center justify-between border-b border-border-color z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary"><i className={`fa-solid ${icon}`}></i></div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function InputField({ label, type = 'text', value, onChange, required, hint }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full px-4 py-3 bg-bg-base border border-border-color rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
      {hint && <p className="text-[10px] font-bold text-slate-400 mt-1 ml-1 uppercase tracking-widest">{hint}</p>}
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-bg-base border border-border-color rounded-xl font-medium appearance-none focus:ring-2 focus:ring-primary/20 outline-none transition-all">
        {options.map(o => <option key={o.v} value={o.v} disabled={o.disabled}>{o.l}</option>)}
      </select>
    </div>
  )
}

function ErrorBox({ text }) {
  return <div className="bg-red-50 text-status-danger text-xs font-semibold p-4 rounded-xl border border-red-100"><i className="fa-solid fa-circle-exclamation mr-1"></i> {text}</div>
}
