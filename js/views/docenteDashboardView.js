function renderDocenteDashboard() {
    const docenteName = escapeHTML(currentProfile?.nombre || 'Docente Evaluador');
    // We render the shell and call a loader immediately after
    setTimeout(() => {
        loadDocenteProjects();
        // Trigger default tab selection
        docenteShowTab('pendientes');
    }, 100);

    return `
        <div class="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
            <!-- Sidebar -->
            <aside class="w-full md:w-72 bg-surface border-r border-border-color p-6 flex flex-col gap-2 shrink-0">
                <nav class="flex flex-col gap-1 flex-grow">
                    <a href="#" id="sb-doc-pendientes" onclick="docenteShowTab('pendientes'); return false;" 
                        class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group active">
                        <i class="fa-solid fa-clock-rotate-left text-lg opacity-70 group-hover:scale-110 transition-transform"></i> Asignados / Pendientes
                    </a>
                    <a href="#" id="sb-doc-enviadas" onclick="docenteShowTab('enviadas'); return false;" 
                        class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group">
                        <i class="fa-solid fa-check-double text-lg opacity-70 group-hover:scale-110 transition-transform"></i> Evaluaciones enviadas
                    </a>
                    <a href="#" id="sb-doc-revision" onclick="docenteShowTab('revision'); return false;" 
                        class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group">
                        <i class="fa-solid fa-magnifying-glass-chart text-lg opacity-70 group-hover:scale-110 transition-transform"></i> Proyectos para Revisión
                    </a>
                    <a href="#" id="sb-doc-perfil" onclick="docenteShowTab('perfil'); return false;" 
                        class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group">
                        <i class="fa-solid fa-user text-lg opacity-70 group-hover:scale-110 transition-transform"></i> Mi perfil
                    </a>
                </nav>

                <div class="pt-6 border-t border-border-color">
                    <a href="#" onclick="handleLogout(); return false;" class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-status-danger hover:bg-red-50 transition-all group">
                        <i class="fa-solid fa-arrow-right-from-bracket text-lg opacity-70 group-hover:translate-x-1 transition-transform"></i> Cerrar sesión
                    </a>
                </div>
            </aside>

            <!-- Main Context -->
            <main class="flex-grow p-6 md:p-10 bg-bg-base overflow-y-auto w-full">
                <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Hola, Prof. ${docenteName}</h1>
                        <p class="text-slate-500 mt-1 font-medium">Panel de Evaluación RuedaPro UNIPAZ</p>
                    </div>
                </div>

                <!-- Stats Summary -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div class="bg-surface p-6 rounded-3xl shadow-sm border border-border-color flex items-center gap-5 hover:shadow-md transition-shadow">
                        <div class="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center text-2xl shadow-sm">
                            <i class="fa-solid fa-folder-open"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Asignados</p>
                            <p class="text-3xl font-black text-slate-800" id="doc-stat-asignados">0</p>
                        </div>
                    </div>
                    
                    <div class="bg-surface p-6 rounded-3xl shadow-sm border border-border-color flex items-center gap-5 hover:shadow-md transition-shadow">
                        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shadow-sm">
                            <i class="fa-solid fa-hourglass-half"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pendientes</p>
                            <p class="text-3xl font-black text-slate-800" id="doc-stat-pendientes">0</p>
                        </div>
                    </div>
                    
                    <div class="bg-surface p-6 rounded-3xl shadow-sm border border-border-color flex items-center gap-5 hover:shadow-md transition-shadow">
                        <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shadow-sm">
                            <i class="fa-solid fa-check-to-slot"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Enviados</p>
                            <p class="text-3xl font-black text-slate-800" id="doc-stat-enviados">0</p>
                        </div>
                    </div>
                </div>

                <!-- TAB: Pendientes -->
                <div id="doc-tab-pendientes" class="block animate-in fade-in duration-500">
                    <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span class="w-2 h-8 bg-primary rounded-full"></span>
                        Proyectos Pendientes de Evaluación
                    </h2>
                    <div class="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/50 border-b border-border-color">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Proyecto</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Periodo</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="docente-pendientes-tbody" class="divide-y divide-border-color">
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center">
                                        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-primary opacity-40 mb-2"></i>
                                        <p class="text-slate-500 font-medium">Cargando tus asignaciones pendientes...</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- TAB: Enviadas -->
                <div id="doc-tab-enviadas" class="hidden animate-in fade-in duration-500">
                    <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span class="w-2 h-8 bg-emerald-500 rounded-full"></span>
                        Evaluaciones Enviadas
                    </h2>
                    <div class="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/50 border-b border-border-color">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Proyecto</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Periodo</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Resultado</th>
                                </tr>
                            </thead>
                            <tbody id="docente-enviadas-tbody" class="divide-y divide-border-color">
                                <tr>
                                    <td colspan="4" class="px-6 py-12 text-center text-slate-500">Cargando evaluaciones enviadas...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- TAB: Mi Perfil -->
                <div id="doc-tab-perfil" class="hidden animate-in fade-in duration-500">
                    <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span class="w-2 h-8 bg-slate-400 rounded-full"></span>
                        Mi Perfil
                    </h2>
                    
                    <div class="bg-surface p-8 max-w-2xl rounded-3xl shadow-premium border border-border-color">
                        <div class="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                            <div class="shrink-0 relative group">
                                <div class="w-32 h-32 rounded-3xl bg-primary-light flex items-center justify-center text-5xl font-black text-primary border-4 border-white shadow-lg overflow-hidden transition-transform group-hover:scale-105">
                                    ${docenteName.charAt(0)}
                                </div>
                                <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full shadow-sm"></div>
                            </div>
                            
                            <div class="w-full space-y-6">
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Nombre Completo</label>
                                    <div class="px-5 py-4 bg-bg-base rounded-2xl border border-border-color text-slate-700 font-bold text-lg shadow-sm">
                                        ${docenteName}
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Rol</label>
                                        <div class="px-4 py-3 bg-primary/5 rounded-xl border border-primary/10 text-primary font-bold text-sm capitalize">
                                            <i class="fa-solid fa-user-shield mr-2 opacity-30 text-xs"></i> ${currentProfile?.rol || 'No definido'}
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">ID Usuario</label>
                                        <div class="px-4 py-3 bg-slate-50 rounded-xl border border-border-color text-slate-500 font-mono text-[10px] truncate">
                                            #${currentProfile?.id?.substring(0, 8) || '---'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB: Proyectos para Revisión -->
                <div id="doc-tab-revision" class="hidden animate-in fade-in duration-500">
                    <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span class="w-2 h-8 bg-blue-500 rounded-full"></span>
                        Proyectos Asignados para Revisión
                    </h2>
                    <div class="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/50 border-b border-border-color">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Proyecto</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Estudiante</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Fecha</th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="doc-revision-tbody" class="divide-y divide-border-color">
                                <tr><td colspan="5" class="px-6 py-12 text-center text-slate-500 italic font-medium">Cargando...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
}

// UI Function to switch tabs in Docente Dashboard
function docenteShowTab(tabName) {
    const tabs = ['pendientes', 'enviadas', 'revision', 'perfil'];
    tabs.forEach(t => {
        const el   = document.getElementById(`doc-tab-${t}`);
        const link = document.getElementById(`sb-doc-${t}`);
        if (el) {
            if (t === tabName) el.classList.remove('hidden');
            else el.classList.add('hidden');
        }
        if (link) {
            if (t === tabName) {
                link.classList.add('bg-primary-light', 'text-primary', 'shadow-sm');
                link.classList.remove('text-slate-600', 'hover:bg-slate-50');
            } else {
                link.classList.remove('bg-primary-light', 'text-primary', 'shadow-sm');
                link.classList.add('text-slate-600', 'hover:bg-slate-50');
            }
        }
    });
    if (tabName === 'perfil')   loadDocenteProfileInfo();
    if (tabName === 'revision') loadDocenteRevision();
}

async function loadDocenteProjects() {
    if(!supabaseClient || !currentProfile) return;
    
    const pendientesTbody = document.getElementById('docente-pendientes-tbody');
    const enviadasTbody = document.getElementById('docente-enviadas-tbody');
    
    try {
        // Fetch projects assigned to this docente via the junction table
        const { data: assignments, error } = await supabaseClient
            .from('proyecto_evaluadores')
            .select(`
                proyecto_id,
                proyectos (
                    id,
                    nombre,
                    categoria,
                    semestre,
                    anio,
                    estado,
                    estado,
                    evaluaciones (evaluador_id, puntaje_final)
                )
            `)
            .eq('evaluador_id', currentProfile.id);

        if(error) throw error;

        let pendientesHTML = '';
        let enviadasHTML = '';
        let totalAsignados = assignments.length;
        let totalPendientes = 0;
        let totalEnviados = 0;

        const catClass = { 
            'Desarrollo': 'bg-blue-100 text-blue-700', 
            'Propuesta': 'bg-amber-100 text-amber-700', 
            'Aplicación': 'bg-emerald-100 text-emerald-700',
            'Aplicado': 'bg-emerald-100 text-emerald-700'
        };

        assignments.forEach(a => {
            const p = a.proyectos;
            if(!p) return;
            
            // A project is considered "Enviada" for THIS docente if there's an evaluation record from them
            const myEvaluation = p.evaluaciones ? p.evaluaciones.find(e => e.evaluador_id === currentProfile.id) : null;

            if(!myEvaluation) {
                totalPendientes++;
                pendientesHTML += `
                    <tr class="hover:bg-slate-50/50 transition-colors group">
                        <td class="px-6 py-4">
                            <p class="font-bold text-slate-800 group-hover:text-primary transition-colors">${escapeHTML(p.nombre)}</p>
                        </td>
                        <td class="px-6 py-4 text-sm">
                            <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${catClass[p.categoria] || 'bg-slate-100 text-slate-600'}">${escapeHTML(p.categoria)}</span>
                        </td>
                        <td class="px-6 py-4 text-sm font-medium text-slate-500">${escapeHTML(p.semestre)}° / ${escapeHTML(p.anio)}</td>
                        <td class="px-6 py-4 text-sm">
                            <span class="flex items-center gap-1.5 text-amber-600 font-bold uppercase tracking-widest text-[10px]">
                                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pendiente
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <button class="bg-primary text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:scale-95" 
                                onclick="navigateTo('evaluacion', { projectId: '${p.id}' })">
                                CALIFICAR <i class="fa-solid fa-angle-right ml-1"></i>
                            </button>
                        </td>
                    </tr>
                `;
            } else {
                totalEnviados++;
                const score = parseFloat(myEvaluation.puntaje_final || 0).toFixed(1);
                
                enviadasHTML += `
                    <tr class="hover:bg-slate-50/50 transition-colors">
                        <td class="px-6 py-4">
                            <p class="font-bold text-slate-800">${escapeHTML(p.nombre)}</p>
                        </td>
                        <td class="px-6 py-4 text-sm">
                            <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${catClass[p.categoria] || 'bg-slate-100 text-slate-600'}">${escapeHTML(p.categoria)}</span>
                        </td>
                        <td class="px-6 py-4 text-sm font-medium text-slate-500">${escapeHTML(p.semestre)}° / ${escapeHTML(p.anio)}</td>
                        <td class="px-6 py-4 text-right">
                            <div class="inline-flex items-center gap-3">
                                <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Enviado</span>
                                <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black shadow-sm border border-emerald-100">${escapeHTML(score)}</span>
                            </div>
                        </td>
                    </tr>
                `;
            }
        });

        if (totalPendientes === 0) {
            pendientesHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 italic">No tienes proyectos pendientes de evaluación.</td></tr>`;
        }
        if (totalEnviados === 0) {
            enviadasHTML = `<tr><td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">Aún no has enviado ninguna evaluación.</td></tr>`;
        }

        if(pendientesTbody) pendientesTbody.innerHTML = pendientesHTML;
        if(enviadasTbody) enviadasTbody.innerHTML = enviadasHTML;

        // Update stats UI
        document.getElementById('doc-stat-asignados').textContent = totalAsignados;
        document.getElementById('doc-stat-pendientes').textContent = totalPendientes;
        document.getElementById('doc-stat-enviados').textContent = totalEnviados;

    } catch (e) {
        console.error("loadDocenteProjects Error:", e);
        if(pendientesTbody) pendientesTbody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center; padding: 2rem;">Error al cargar tus asignaciones.</td></tr>`;
        if(enviadasTbody) enviadasTbody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center; padding: 2rem;">Error al cargar tus asignaciones.</td></tr>`;
    }
}

// --- AVATAR & PROFILE LOAD LOGIC ---
async function loadDocenteProfileInfo() {
    return;
}

// ── REVISIÓN DE POSTULACIONES ─────────────────────────────────────────────

async function loadDocenteRevision() {
    if (!supabaseClient || !currentProfile) return;
    const tbody = document.getElementById('doc-revision-tbody');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-slate-500 font-medium"><i class="fa-solid fa-circle-notch fa-spin mr-2 text-primary"></i> Cargando...</td></tr>`;
    try {
        const { data, error } = await supabaseClient
            .from('postulaciones')
            .select(`*, estudiante:perfiles!postulaciones_estudiante_id_fkey (nombre)`)
            .eq('docente_revisor_id', currentProfile.id)
            .eq('estado', 'En revisión')
            .order('created_at', { ascending: false });
        if (error) throw error;

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 italic">No tienes proyectos asignados para revisión.</td></tr>`;
            return;
        }
        const catClass = { 
            'Desarrollo':'bg-blue-100 text-blue-700', 
            'Propuesta':'bg-amber-100 text-amber-700', 
            'Aplicado':'bg-emerald-100 text-emerald-700' 
        };
        tbody.innerHTML = data.map(p => {
            const fecha = new Date(p.created_at).toLocaleDateString('es-CO');
            return `
                <tr class="hover:bg-slate-50 transition-colors group">
                    <td class="px-6 py-4">
                        <p class="font-bold text-slate-800 group-hover:text-primary transition-colors">${escapeHTML(p.nombre)}</p>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600 font-medium">${escapeHTML(p.estudiante?.nombre || '—')}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${catClass[p.categoria] || 'bg-slate-100 text-slate-600'}">${escapeHTML(p.categoria)}</span>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-400 font-mono italic">${fecha}</td>
                    <td class="px-6 py-4 text-right">
                        <button class="bg-primary text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5" 
                            onclick="abrirModalRevision('${p.id}')">
                            <i class="fa-solid fa-file-pen mr-1"></i> REVISAR
                        </button>
                    </td>
                </tr>`;
        }).join('');
    } catch (err) {
        console.error('loadDocenteRevision Error:', err);
        tbody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center; padding:2rem;">Error al cargar.</td></tr>`;
    }
}

let currentRevPostId   = null;
let currentRevPostData = null;

async function abrirModalRevision(id) {
    currentRevPostId = id;
    // Inject modal if not present
    if (!document.getElementById('revision-post-modal')) {
        document.body.insertAdjacentHTML('beforeend', `
        <div id="revision-post-modal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex justify-center items-center p-4">
            <div class="bg-surface rounded-[40px] w-full max-w-[620px] shadow-2xl border border-white/20 transform transition-all duration-300 scale-95 opacity-0 overflow-hidden" id="rev-modal-content">
                <div class="p-8 pb-0 flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary text-xl">
                            <i class="fa-solid fa-file-signature"></i>
                        </div>
                        <h3 class="text-2xl font-black text-slate-800 tracking-tight">Revisar Proyecto</h3>
                    </div>
                    <button onclick="cerrarModalRevision()" class="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all font-bold">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <div class="p-8 space-y-8">
                    <div id="rev-details" class="bg-slate-50 border border-slate-100 rounded-[32px] p-6"></div>
                    
                    <div class="space-y-3">
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Retroalimentación para el Estudiante</label>
                        <textarea id="rev-observacion" rows="5" placeholder="Indica errores, mejoras sugeridas o el motivo de la aprobación..." 
                            class="w-full p-6 bg-bg-base border border-border-color rounded-3xl text-sm text-slate-700 font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none shadow-sm placeholder:italic"></textarea>
                    </div>
                    
                    <div id="rev-error" class="hidden bg-red-50 text-status-danger text-xs font-bold p-4 rounded-2xl border border-red-100 animate-pulse"></div>
                    
                    <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                        <button onclick="enviarRevision('No aprobado')" class="flex-1 px-8 py-5 rounded-2xl border-2 border-red-100 text-status-danger font-black hover:bg-red-50 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                             <i class="fa-solid fa-circle-xmark opacity-50"></i> No aprobado
                        </button>
                        <button onclick="enviarRevision('Aprobado')" class="flex-1 px-8 py-5 rounded-2xl bg-primary text-white font-black hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                            <i class="fa-solid fa-circle-check opacity-50"></i> Aprobado
                        </button>
                    </div>
                </div>
            </div>
        </div>`);
    }

    const modal   = document.getElementById('revision-post-modal');
    const content = document.getElementById('rev-modal-content');
    const details = document.getElementById('rev-details');
    const errBox  = document.getElementById('rev-error');
    
    errBox.classList.add('hidden');
    document.getElementById('rev-observacion').value = '';
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);

    details.innerHTML = `
        <div class="flex justify-center py-4">
            <i class="fa-solid fa-circle-notch fa-spin text-2xl text-primary opacity-40"></i>
        </div>`;

    try {
        const { data: p, error } = await supabaseClient
            .from('postulaciones')
            .select(`*, estudiante:perfiles!postulaciones_estudiante_id_fkey (nombre)`)
            .eq('id', id).single();
        if (error) throw error;
        currentRevPostData = p;

        let downloadBtn = '';
        if (p.archivo_path) {
            const { data: sd } = await supabaseClient.storage.from('postulaciones-docs').createSignedUrl(p.archivo_path, 3600);
            if (sd?.signedUrl) {
                downloadBtn = `
                    <a href="${sd.signedUrl}" target="_blank" class="w-full mt-6 flex items-center justify-between p-4 bg-white border border-blue-100 rounded-2xl hover:bg-blue-50 transition-all group">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <i class="fa-solid fa-file-word text-lg"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Documento Adjunto</p>
                                <p class="text-sm font-bold text-slate-700">Propuesta de Proyecto.docx</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-download text-blue-300 group-hover:text-blue-500 transition-colors mr-2"></i>
                    </a>`;
            }
        }
        const catClass = { 
            'Desarrollo':'bg-blue-100 text-blue-700', 
            'Propuesta':'bg-amber-100 text-amber-700', 
            'Aplicado':'bg-emerald-100 text-emerald-700' 
        };
        details.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex-grow">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Título del Proyecto</p>
                        <h4 class="text-xl font-bold text-slate-800 leading-tight">${escapeHTML(p.nombre)}</h4>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estudiante</p>
                        <p class="text-sm font-bold text-slate-700 flex items-center gap-2 italic">
                            <i class="fa-solid fa-user text-xs opacity-30"></i> ${escapeHTML(p.estudiante?.nombre || '—')}
                        </p>
                    </div>
                    <div class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Categoría</p>
                        <span class="inline-block px-3 py-1 bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-widest rounded-lg">${escapeHTML(p.categoria)}</span>
                    </div>
                </div>
                ${downloadBtn}
            </div>`;
    } catch (err) {
        console.error('abrirModalRevision Error:', err);
        details.innerHTML = `<p style="color:var(--status-danger);">Error al cargar los detalles.</p>`;
    }
}

function cerrarModalRevision() {
    const modal = document.getElementById('revision-post-modal');
    const content = document.getElementById('rev-modal-content');
    if (modal) {
        content.classList.add('scale-95', 'opacity-0');
        content.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 200);
    }
    currentRevPostId   = null;
    currentRevPostData = null;
}

async function enviarRevision(decision) {
    if (!supabaseClient || !currentRevPostId || !currentRevPostData) return;
    const observacion = document.getElementById('rev-observacion').value.trim();
    const errBox = document.getElementById('rev-error');
    errBox.classList.add('hidden');

    if (!observacion) {
        errBox.textContent = 'La observación es obligatoria.';
        errBox.classList.remove('hidden');
        return;
    }

    try {
        const updates = { estado: decision, observacion_docente: escapeHTML(observacion) };

        // If approved, auto-create project in proyectos table
        if (decision === 'Aprobado') {
            const now      = new Date();
            const semestre = now.getMonth() < 6 ? 1 : 2;
            const anio     = now.getFullYear();
            // Map 'Aplicado' → 'Aplicación' for proyectos table
            const catMap   = { 'Aplicado': 'Aplicación', 'Propuesta': 'Propuesta', 'Desarrollo': 'Desarrollo' };

            const { data: newProj, error: projErr } = await supabaseClient
                .from('proyectos')
                .insert([{
                    nombre:    currentRevPostData.nombre,
                    categoria: catMap[currentRevPostData.categoria] || currentRevPostData.categoria,
                    semestre,
                    anio,
                    estado:    'Pendiente'
                }])
                .select().single();
            if (projErr) throw projErr;

            // Link student
            if (currentRevPostData.estudiante_id && newProj) {
                await supabaseClient.from('proyecto_estudiantes')
                    .insert([{ proyecto_id: newProj.id, estudiante_id: currentRevPostData.estudiante_id }]);
            }
            updates.proyecto_id = newProj.id;
        }

        const { error: updErr } = await supabaseClient
            .from('postulaciones')
            .update(updates)
            .eq('id', currentRevPostId);
        if (updErr) throw updErr;

        cerrarModalRevision();
        loadDocenteRevision();

    } catch (err) {
        console.error('enviarRevision Error:', err);
        errBox.textContent = 'Error al guardar la revisión: ' + (err.message || '');
        errBox.classList.remove('hidden');
    }
}
