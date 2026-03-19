/**
 * estudianteDashboardView.js
 * Panel del estudiante: evaluaciones asignadas, postulación de proyectos, historial.
 */

function renderEstudianteDashboard() {
    const estudianteName = escapeHTML(currentProfile?.nombre || 'Estudiante');
    setTimeout(() => { estudianteShowTab('evaluaciones'); }, 100);

    return `
        <div class="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
            <!-- Sidebar -->
            <aside class="w-full md:w-72 bg-surface border-r border-border-color p-6 flex flex-col gap-2">
                <div class="px-4 pb-6 border-b border-border-color mb-6">
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Sesión activa</p>
                    <p class="text-sm font-bold text-primary truncate">${estudianteName}</p>
                </div>
                
                <nav class="flex flex-col gap-1 flex-grow">
                    <a href="#" id="sb-est-evaluaciones" onclick="estudianteShowTab('evaluaciones'); return false;" 
                        class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group active">
                        <i class="fa-solid fa-star-half-stroke text-lg opacity-70 group-hover:scale-110 transition-transform"></i> Mis Evaluaciones
                    </a>
                    <a href="#" id="sb-est-postular" onclick="estudianteShowTab('postular'); return false;" 
                        class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group">
                        <i class="fa-solid fa-file-arrow-up text-lg opacity-70 group-hover:scale-110 transition-transform"></i> Postular Proyecto
                    </a>
                    <a href="#" id="sb-est-historial" onclick="estudianteShowTab('historial'); return false;" 
                        class="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group">
                        <i class="fa-solid fa-folder-clock text-lg opacity-70 group-hover:scale-110 transition-transform"></i> Mis Postulaciones
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
                <!-- TAB: Evaluaciones -->
                <div id="est-tab-evaluaciones" class="space-y-8 block">
                    <div class="flex items-center justify-between mb-8">
                        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Mis Proyectos Asignados</h1>
                    </div>
                    <div id="estudiante-data-container" class="grid grid-cols-1 gap-8 text-center py-12 w-full">
                        <div class="bg-surface p-12 rounded-3xl shadow-premium border border-border-color w-full">
                            <i class="fa-solid fa-circle-notch fa-spin text-4xl text-primary mb-4"></i>
                            <p class="text-slate-500 font-medium">Buscando tus datos de evaluación...</p>
                        </div>
                    </div>
                </div>

                <!-- TAB: Postular Proyecto -->
                <div id="est-tab-postular" class="space-y-8 hidden">
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Postular Proyecto</h1>
                        <p class="text-slate-500 mt-2">Sube tu proyecto para revisión previa antes de la Rueda.</p>
                    </div>
                    
                    <div class="max-w-2xl bg-surface p-8 md:p-10 rounded-3xl shadow-premium border border-border-color">
                        <form id="form-postular" onsubmit="handlePostularProyecto(event)" class="space-y-6">
                            <div class="space-y-2">
                                <label class="block text-sm font-bold text-slate-700 ml-1">Nombre del Proyecto *</label>
                                <input type="text" id="post-nombre" required placeholder="Ej. Sistema de monitoreo IoT para invernaderos"
                                    class="w-full px-5 py-4 bg-bg-base border border-border-color rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400">
                            </div>
                            
                            <div class="space-y-2">
                                <label class="block text-sm font-bold text-slate-700 ml-1">Categoría *</label>
                                <select id="post-categoria" required 
                                    class="w-full px-5 py-4 bg-bg-base border border-border-color rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                    <option value="">-- Selecciona una categoría --</option>
                                    <option value="Propuesta">Propuesta</option>
                                    <option value="Desarrollo">Desarrollo</option>
                                    <option value="Aplicado">Aplicado</option>
                                </select>
                            </div>
                            
                            <div class="space-y-2">
                                <label class="block text-sm font-bold text-slate-700 ml-1">Archivo Word (.doc / .docx) *</label>
                                <div class="group relative border-2 border-dashed border-border-color hover:border-primary rounded-2xl p-8 text-center bg-bg-base hover:bg-primary-light transition-all cursor-pointer" onclick="document.getElementById('post-archivo').click()">
                                    <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                        <i class="fa-solid fa-cloud-arrow-up text-2xl text-primary"></i>
                                    </div>
                                    <p class="text-slate-600 font-semibold mb-1 group-hover:text-primary transition-colors">Haz clic para seleccionar el archivo</p>
                                    <p id="post-archivo-nombre" class="text-primary font-bold text-sm truncate max-w-xs mx-auto">Ningún archivo seleccionado</p>
                                    <p class="text-slate-400 text-[10px] mt-2 uppercase tracking-widest font-bold font-mono">Word &bull; Máx. 10 MB</p>
                                </div>
                                <input type="file" id="post-archivo" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    required class="hidden"
                                    onchange="document.getElementById('post-archivo-nombre').textContent = this.files[0]?.name || 'Ningún archivo seleccionado'">
                            </div>

                            <div id="post-error" class="hidden animate-pulse bg-red-50 text-status-danger text-sm font-semibold p-4 rounded-xl border border-red-100"></div>
                            <div id="post-success" class="hidden bg-green-50 text-emerald-700 text-sm font-semibold p-4 rounded-xl border border-green-100"></div>

                            <button type="submit" id="btn-postular" 
                                class="w-full bg-primary text-white font-bold py-5 rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transform hover:-translate-y-1 active:scale-95 transition-all text-lg">
                                <i class="fa-solid fa-paper-plane mr-2"></i> Enviar a Revisión
                            </button>
                        </form>
                    </div>
                </div>

                <!-- TAB: Mis Postulaciones -->
                <div id="est-tab-historial" class="space-y-8 hidden">
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Mis Postulaciones</h1>
                        <p class="text-slate-500 mt-2">Historial y estado de tus proyectos postulados.</p>
                    </div>
                    <div id="historial-postulaciones-container" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="col-span-full py-12 text-center bg-surface border border-border-color rounded-3xl">
                            <i class="fa-solid fa-circle-notch fa-spin text-3xl text-primary opacity-50"></i>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
}

function estudianteShowTab(tabName) {
    const tabs = ['evaluaciones', 'postular', 'historial'];
    tabs.forEach(t => {
        const el = document.getElementById(`est-tab-${t}`);
        const link = document.getElementById(`sb-est-${t}`);
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
    if (tabName === 'evaluaciones') loadEstudianteDashboard();
    if (tabName === 'historial') loadMisPostulaciones();
}

// ── POSTULAR PROYECTO ─────────────────────────────────────────────────────────
async function handlePostularProyecto(e) {
    e.preventDefault();
    if (!supabaseClient || !currentProfile) return;

    const btn = document.getElementById('btn-postular');
    const errBox = document.getElementById('post-error');
    const okBox  = document.getElementById('post-success');
    errBox.classList.add('hidden');
    okBox.classList.add('hidden');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Subiendo...';

    const nombre    = document.getElementById('post-nombre').value.trim();
    const categoria = document.getElementById('post-categoria').value;
    const archivo   = document.getElementById('post-archivo').files[0];

    if (!archivo) {
        errBox.textContent = 'Por favor selecciona un archivo Word.';
        errBox.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i> Enviar a Revisión';
        return;
    }

    try {
        // 1. Upload file
        // Sanitize filename: remove all chars not allowed by Supabase Storage
        const safeName = archivo.name
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9._\-]/g, '');
        const filePath = `${currentProfile.id}/${Date.now()}_${safeName}`;
        const { error: uploadError } = await supabaseClient.storage
            .from('postulaciones-docs')
            .upload(filePath, archivo, { upsert: false });
        if (uploadError) throw uploadError;

        // 2. Insert record
        const { error: insertError } = await supabaseClient
            .from('postulaciones')
            .insert([{
                estudiante_id: currentProfile.id,
                nombre: escapeHTML(nombre),
                categoria: escapeHTML(categoria),
                archivo_path: filePath,
                estado: 'Pendiente de revisión'
            }]);
        if (insertError) throw insertError;

        // 3. Reset and show success
        document.getElementById('form-postular').reset();
        document.getElementById('post-archivo-nombre').textContent = 'Ningun archivo seleccionado';
        okBox.innerHTML = '<i class="fa-solid fa-circle-check mr-2"></i> ¡Proyecto enviado exitosamente! El administrador revisará tu postulación pronto.';
        okBox.classList.remove('hidden');

    } catch (err) {
        console.error('handlePostularProyecto Error:', err);
        errBox.textContent = 'Error al subir el proyecto: ' + (err.message || 'Error desconocido');
        errBox.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i> Enviar a Revisión';
    }
}

// ── MIS POSTULACIONES ─────────────────────────────────────────────────────────
async function loadMisPostulaciones() {
    if (!supabaseClient || !currentProfile) return;
    const container = document.getElementById('historial-postulaciones-container');
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('postulaciones')
            .select(`*, revisor:perfiles!postulaciones_docente_revisor_id_fkey (nombre)`)
            .eq('estudiante_id', currentProfile.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full bg-surface p-16 rounded-3xl border border-border-color text-center shadow-sm">
                    <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fa-solid fa-folder-open text-3xl text-slate-400"></i>
                    </div>
                    <p class="text-xl font-bold text-slate-800 mb-2">Sin postulaciones</p>
                    <p class="text-slate-500 mb-8">Aún no has postulado ningún proyecto para este periodo.</p>
                    <button class="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20" onclick="estudianteShowTab('postular')">Postular ahora</button>
                </div>`;
            return;
        }

        const estadoConfig = {
            'Pendiente de revisión': { badge: 'bg-amber-100 text-amber-700', icon: 'fa-clock' },
            'En revisión':           { badge: 'bg-blue-100 text-blue-700',    icon: 'fa-magnifying-glass' },
            'Aprobado':              { badge: 'bg-emerald-100 text-emerald-700', icon: 'fa-circle-check' },
            'No aprobado':           { badge: 'bg-red-100 text-red-700',  icon: 'fa-circle-xmark' }
        };

        container.innerHTML = data.map(p => {
            const cfg   = estadoConfig[p.estado] || { badge: 'bg-slate-100 text-slate-600', icon: 'fa-question' };
            const fecha = new Date(p.created_at).toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' });
            const revisor = p.revisor?.nombre
                ? `<p class="text-xs text-slate-500 mt-2 font-medium"><i class="fa-solid fa-user-tie mr-1 opacity-70"></i> Revisor: ${escapeHTML(p.revisor.nombre)}</p>` : '';
            const obs = p.observacion_docente
                ? `<div class="mt-6 p-4 bg-slate-50 rounded-2xl border-l-4 border-primary">
                        <p class="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Comentarios del revisor</p>
                        <p class="text-sm text-slate-700 leading-relaxed">${escapeHTML(p.observacion_docente)}</p>
                   </div>` : '';

            return `
                <div class="bg-surface p-6 rounded-3xl border border-border-color shadow-sm hover:shadow-premium transition-all duration-300">
                    <div class="flex justify-between items-start gap-4 mb-4">
                        <div class="flex-grow min-w-0">
                            <h3 class="text-lg font-bold text-slate-900 truncate mb-1">${escapeHTML(p.nombre)}</h3>
                            <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span class="text-xs font-semibold text-slate-500"><i class="fa-solid fa-layer-group mr-1 opacity-70"></i> ${escapeHTML(p.categoria)}</span>
                                <span class="text-xs font-semibold text-slate-400"><i class="fa-solid fa-calendar mr-1 opacity-70"></i> ${fecha}</span>
                            </div>
                        </div>
                        <span class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.badge}">
                            <i class="fa-solid ${cfg.icon}"></i> ${escapeHTML(p.estado)}
                        </span>
                    </div>
                    ${revisor}
                    ${obs}
                </div>`;
        }).join('');

    } catch (err) {
        console.error('loadMisPostulaciones Error:', err);
        container.innerHTML = `<div class="card" style="padding:2rem; text-align:center; color:var(--status-danger);"><i class="fa-solid fa-triangle-exclamation"></i> Error al cargar tus postulaciones.</div>`;
    }
}

// ── EVALUACIONES (código original) ───────────────────────────────────────────
async function loadEstudianteDashboard() {
    if(!supabaseClient || !currentProfile) return;
    const container = document.getElementById('estudiante-data-container');
    if (!container) return;

    try {
        const { data: assignments, error: aErr } = await supabaseClient
            .from('proyecto_estudiantes')
            .select(`
                proyecto_id,
                proyectos (
                    id, nombre, categoria, semestre, anio, estado,
                    evaluaciones (
                        puntaje_final,
                        observaciones,
                        perfiles (nombre)
                    )
                )
            `)
            .eq('estudiante_id', currentProfile.id);

        if (aErr) throw aErr;

        if (!assignments || assignments.length === 0) {
            container.innerHTML = `
                <div class="col-span-full bg-surface p-16 rounded-3xl border border-border-color text-center shadow-sm">
                    <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fa-solid fa-folder-open text-3xl text-slate-400"></i>
                    </div>
                    <p class="text-xl font-bold text-slate-800 mb-2">Sin proyectos asignados</p>
                    <p class="text-slate-500">Actualmente no tienes proyectos registrados para evaluación.</p>
                </div>`;
            return;
        }

        let htmlContent = '';
        const catClass = { 
            'Desarrollo': 'bg-blue-100 text-blue-700', 
            'Propuesta': 'bg-amber-100 text-amber-700', 
            'Aplicación': 'bg-emerald-100 text-emerald-700',
            'Aplicado': 'bg-emerald-100 text-emerald-700' 
        };

        for (const a of assignments) {
            const p = a.proyectos;
            if (!p) continue;

            if (p.estado !== 'Evaluado') {
                htmlContent += `
                    <div class="bg-surface rounded-3xl border border-border-color shadow-premium overflow-hidden border-t-8 border-slate-300">
                        <div class="p-8">
                            <h2 class="text-2xl font-bold text-slate-800 mb-2">${escapeHTML(p.nombre)}</h2>
                            <p class="mb-6"><span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${catClass[p.categoria] || 'bg-slate-100 text-slate-600'}">${escapeHTML(p.categoria)}</span></p>
                            
                            <div class="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
                                <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <i class="fa-regular fa-clock text-xl text-slate-400"></i>
                                </div>
                                <p class="text-slate-500 font-medium">Este proyecto aún no ha sido evaluado definitivamente.</p>
                                <p class="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Estado actual: ${escapeHTML(p.estado)}</p>
                            </div>
                        </div>
                    </div>`;
            } else {
                const evalDataList = p.evaluaciones || [];
                if (evalDataList.length > 0) {
                    const totalScore = evalDataList.reduce((acc, curr) => acc + parseFloat(curr.puntaje_final || 0), 0);
                    const avgScore = (totalScore / evalDataList.length).toFixed(1);
                    const allObsHTML = evalDataList.map(ev => {
                        const evalName = escapeHTML(ev.perfiles ? ev.perfiles.nombre : 'Desconocido');
                        const obs = escapeHTML(ev.observaciones || 'Sin observaciones.');
                        return `
                            <div class="bg-slate-50 border border-slate-100 p-6 rounded-2xl relative group hover:bg-white hover:shadow-md transition-all">
                                <i class="fa-solid fa-quote-left absolute top-4 left-4 text-primary opacity-5 text-4xl"></i>
                                <p class="text-slate-700 leading-relaxed relative z-10">${obs.replace(/\n/g,'<br>')}</p>
                                <div class="mt-4 flex items-center justify-end gap-2 text-xs font-bold text-primary opacity-70">
                                    <div class="w-6 h-1 bg-primary/20 rounded-full"></div>
                                    <span>Prof. ${evalName}</span>
                                </div>
                            </div>`;
                    }).join('');

                    htmlContent += `
                        <div class="bg-surface rounded-3xl border border-border-color shadow-premium overflow-hidden border-t-8 border-primary">
                            <div class="p-8">
                                <div class="flex flex-col lg:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-100 mb-8">
                                    <div class="max-w-xl">
                                        <h2 class="text-2xl font-bold text-slate-800 mb-2">${escapeHTML(p.nombre)}</h2>
                                        <div class="flex flex-wrap items-center gap-4">
                                            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${catClass[p.categoria] || 'bg-slate-100 text-slate-600'}">${escapeHTML(p.categoria)}</span>
                                            <span class="text-xs text-slate-500 font-medium"><i class="fa-solid fa-calendar-check mr-1 opacity-60"></i> ${escapeHTML(p.semestre)} - ${escapeHTML(p.anio)}</span>
                                        </div>
                                    </div>
                                    <div class="bg-primary shadow-lg shadow-primary/20 text-white p-6 rounded-2xl text-center min-w-[140px] transform hover:scale-105 transition-transform cursor-default">
                                        <span class="block text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">Nota Final</span>
                                        <span class="text-4xl font-black">${avgScore}</span>
                                    </div>
                                </div>
                                
                                <div class="space-y-6">
                                    <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <i class="fa-solid fa-comment-dots text-primary"></i> Retroalimentación Docente
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        ${allObsHTML}
                                    </div>
                                </div>
                            </div>
                        </div>`;
                }
            }
        }
        container.innerHTML = `<div class="space-y-10 w-full">${htmlContent}</div>`;

    } catch (e) {
        console.error('loadEstudianteDashboard Error:', e);
        container.innerHTML = `
            <div class="col-span-full bg-red-50 p-12 rounded-3xl border border-red-100 text-center">
                <i class="fa-solid fa-triangle-exclamation text-4xl text-status-danger mb-4"></i>
                <p class="text-status-danger font-bold">Error de conexión</p>
                <p class="text-red-600/70 text-sm mt-1">No pudimos cargar la información de tus proyectos. Por favor intenta de nuevo.</p>
            </div>`;
    }
}
