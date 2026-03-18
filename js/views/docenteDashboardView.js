function renderDocenteDashboard() {
    const docenteName = escapeHTML(currentProfile?.nombre || 'Docente Evaluador');
    // We render the shell and call a loader immediately after
    setTimeout(() => {
        loadDocenteProjects();
        // Trigger default tab selection
        docenteShowTab('pendientes');
    }, 100);

    return `
        <div class="dashboard-layout">
            <!-- Sidebar -->
            <aside class="dashboard-sidebar">
                <a href="#" class="sidebar-link active" id="sb-doc-pendientes" onclick="docenteShowTab('pendientes'); return false;"><i class="fa-solid fa-clock-rotate-left"></i> Asignados / Pendientes</a>
                <a href="#" class="sidebar-link" id="sb-doc-enviadas" onclick="docenteShowTab('enviadas'); return false;"><i class="fa-solid fa-check-double"></i> Evaluaciones enviadas</a>
                <a href="#" class="sidebar-link" id="sb-doc-revision" onclick="docenteShowTab('revision'); return false;"><i class="fa-solid fa-magnifying-glass-chart"></i> Proyectos para Revisión</a>
                <a href="#" class="sidebar-link" id="sb-doc-perfil" onclick="docenteShowTab('perfil'); return false;"><i class="fa-solid fa-user"></i> Mi perfil</a>
                <div style="margin-top: auto;">
                    <a href="#" onclick="handleLogout(); return false;" class="sidebar-link" style="color: var(--status-danger);"><i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión</a>
                </div>
            </aside>

            <!-- Main Content -->
            <div class="dashboard-main">
                <div class="dashboard-header">
                    <div>
                        <h1>Hola, Prof. ${docenteName}</h1>
                        <p style="color: var(--text-secondary);">Panel de Evaluación RuedaPro UNIPAZ</p>
                    </div>
                </div>

                <!-- Stats Summary -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon" style="background-color: var(--primary-light); color: var(--primary-color);"><i class="fa-solid fa-folder-open"></i></div>
                        <div class="stat-info">
                            <h3>Total Asignados</h3>
                            <div class="stat-value" id="doc-stat-asignados">0</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background-color: #FEF3C7; color: #D97706;"><i class="fa-solid fa-hourglass-half"></i></div>
                        <div class="stat-info">
                            <h3>Pendientes</h3>
                            <div class="stat-value" id="doc-stat-pendientes">0</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon" style="background-color: #D1FAE5; color: #059669;"><i class="fa-solid fa-check-to-slot"></i></div>
                        <div class="stat-info">
                            <h3>Enviados</h3>
                            <div class="stat-value" id="doc-stat-enviados">0</div>
                        </div>
                    </div>
                </div>

                <!-- TAB: Pendientes -->
                <div id="doc-tab-pendientes" style="display: block;">
                    <h2 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.3rem;">Proyectos Pendientes de Evaluación</h2>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Proyecto</th>
                                    <th>Categoría</th>
                                    <th>Semestre / Año</th>
                                    <th>Estado</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody id="docente-pendientes-tbody">
                                <tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-secondary);">Cargando tus asignaciones pendientes...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- TAB: Enviadas -->
                <div id="doc-tab-enviadas" style="display: none;">
                    <h2 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.3rem;">Evaluaciones Enviadas</h2>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Proyecto</th>
                                    <th>Categoría</th>
                                    <th>Semestre / Año</th>
                                    <th>Estado / Nota</th>
                                </tr>
                            </thead>
                            <tbody id="docente-enviadas-tbody">
                                <tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-secondary);">Cargando evaluaciones enviadas...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- TAB: Mi Perfil -->
                <div id="doc-tab-perfil" style="display: none;">
                    <h2 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.3rem;">Mi Perfil</h2>
                    <div class="card" style="padding: 2rem; max-width: 600px;">
                        <div style="display: flex; gap: 2rem; align-items: flex-start;">
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                                <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 4px solid var(--primary-color); background-color: var(--primary-light); color: var(--primary-color); display: flex; align-items: center; justify-content: center; font-size: 4rem; font-weight: bold; text-transform: uppercase;">
                                    ${docenteName.charAt(0)}
                                </div>
                            </div>
                            <div style="flex: 1;">
                                <div style="margin-bottom: 1.5rem;">
                                    <label style="display: block; margin-bottom: 0.3rem; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase;">Nombre Completo</label>
                                    <div style="font-size: 1.1rem; color: var(--text-primary); font-weight: 500; padding: 0.5rem; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-color);">${docenteName}</div>
                                </div>
                                <div style="margin-bottom: 1.5rem;">
                                    <label style="display: block; margin-bottom: 0.3rem; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase;">Rol del Sistema</label>
                                    <div style="font-size: 1.1rem; color: var(--text-primary); font-weight: 500; padding: 0.5rem; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-color); text-transform: capitalize;">${currentProfile?.rol || 'No definido'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB: Proyectos para Revisión -->
                <div id="doc-tab-revision" style="display: none;">
                    <h2 style="margin-bottom: 1rem; color: var(--text-primary); font-size: 1.3rem;">Proyectos Asignados para Revisión</h2>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Proyecto</th>
                                    <th>Estudiante</th>
                                    <th>Categoría</th>
                                    <th>Fecha</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody id="doc-revision-tbody">
                                <tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-secondary);">Cargando...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    `;
}

// UI Function to switch tabs in Docente Dashboard
function docenteShowTab(tabName) {
    const tabs = ['pendientes', 'enviadas', 'revision', 'perfil'];
    tabs.forEach(t => {
        const el   = document.getElementById(`doc-tab-${t}`);
        const link = document.getElementById(`sb-doc-${t}`);
        if (el) el.style.display = t === tabName ? 'block' : 'none';
        if (link) {
            if (t === tabName) link.classList.add('active');
            else link.classList.remove('active');
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

        const catClass = { 'Desarrollo': 'badge-info', 'Propuesta': 'badge-warning', 'Aplicación': 'badge-success' };

        assignments.forEach(a => {
            const p = a.proyectos;
            if(!p) return;
            
            // A project is considered "Enviada" for THIS docente if there's an evaluation record from them
            const myEvaluation = p.evaluaciones ? p.evaluaciones.find(e => e.evaluador_id === currentProfile.id) : null;

            if(!myEvaluation) {
                totalPendientes++;
                pendientesHTML += `
                    <tr>
                        <td><strong>${escapeHTML(p.nombre)}</strong></td>
                        <td><span class="badge ${catClass[p.categoria] || ''}">${escapeHTML(p.categoria)}</span></td>
                        <td>${escapeHTML(p.semestre)}° / ${escapeHTML(p.anio)}</td>
                        <td><span class="badge badge-warning">Pendiente (Tú)</span></td>
                        <td>
                            <button class="btn btn-primary" onclick="navigateTo('evaluacion', { projectId: '${p.id}' })">Calificar <i class="fa-solid fa-angle-right"></i></button>
                        </td>
                    </tr>
                `;
            } else {
                totalEnviados++;
                // Get the final score 
                const scoreStr = myEvaluation.puntaje_final || 0;
                const score = parseFloat(scoreStr).toFixed(1);
                
                enviadasHTML += `
                    <tr>
                        <td><strong>${escapeHTML(p.nombre)}</strong></td>
                        <td><span class="badge ${catClass[p.categoria] || ''}">${escapeHTML(p.categoria)}</span></td>
                        <td>${escapeHTML(p.semestre)}° / ${escapeHTML(p.anio)}</td>
                        <td style="font-weight: 700; color: var(--primary-color);">
                            <span class="badge badge-success" style="margin-right: 0.5rem;">Enviado</span> ${escapeHTML(score)}
                        </td>
                    </tr>
                `;
            }
        });

        if (totalPendientes === 0) {
            pendientesHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No tienes proyectos pendientes de evaluación.</td></tr>`;
        }
        if (totalEnviados === 0) {
            enviadasHTML = `<tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-secondary);">Aún no has enviado ninguna evaluación.</td></tr>`;
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
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-secondary);"><i class="fa-solid fa-circle-notch fa-spin"></i> Cargando...</td></tr>`;
    try {
        const { data, error } = await supabaseClient
            .from('postulaciones')
            .select(`*, estudiante:perfiles!postulaciones_estudiante_id_fkey (nombre)`)
            .eq('docente_revisor_id', currentProfile.id)
            .eq('estado', 'En revisión')
            .order('created_at', { ascending: false });
        if (error) throw error;

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-secondary);">No tienes proyectos asignados para revisión.</td></tr>`;
            return;
        }
        const catClass = { 'Desarrollo':'badge-info', 'Propuesta':'badge-warning', 'Aplicado':'badge-success' };
        tbody.innerHTML = data.map(p => {
            const fecha = new Date(p.created_at).toLocaleDateString('es-CO');
            return `
                <tr>
                    <td><strong>${escapeHTML(p.nombre)}</strong></td>
                    <td>${escapeHTML(p.estudiante?.nombre || '—')}</td>
                    <td><span class="badge ${catClass[p.categoria] || ''}">${escapeHTML(p.categoria)}</span></td>
                    <td>${fecha}</td>
                    <td><button class="btn btn-primary" onclick="abrirModalRevision('${p.id}')" style="padding:0.35rem 0.9rem;"><i class="fa-solid fa-file-pen"></i> Revisar</button></td>
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
        <div id="revision-post-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.55); z-index:1000; justify-content:center; align-items:center;">
            <div style="background:var(--bg-surface); padding:2rem; border-radius:16px; width:100%; max-width:580px; box-shadow:0 20px 60px rgba(0,0,0,0.3); max-height:90vh; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <h3 style="color:var(--text-primary); margin:0;"><i class="fa-solid fa-file-pen" style="color:var(--primary-color);"></i> Revisar Proyecto</h3>
                    <button onclick="cerrarModalRevision()" style="background:none; border:none; cursor:pointer; color:var(--text-secondary); font-size:1.2rem;"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div id="rev-details" style="margin-bottom:1rem;"></div>
                <div style="margin-bottom:1rem;">
                    <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight:500;">Observación / Comentario *</label>
                    <textarea id="rev-observacion" rows="4" placeholder="Escribe tus observaciones aquí..." style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary); font-size:0.95rem; resize:vertical; box-sizing:border-box;"></textarea>
                </div>
                <div id="rev-error" style="display:none; color:var(--status-danger); background:#FEE2E2; padding:0.75rem; border-radius:6px; margin-bottom:1rem; font-size:0.9rem;"></div>
                <div style="display:flex; gap:1rem;">
                    <button class="btn btn-outline" onclick="enviarRevision('No aprobado')" style="flex:1; border-color:var(--status-danger); color:var(--status-danger);"><i class="fa-solid fa-circle-xmark"></i> No aprobado</button>
                    <button class="btn btn-primary" onclick="enviarRevision('Aprobado')" style="flex:1;"><i class="fa-solid fa-circle-check"></i> Aprobado</button>
                </div>
            </div>
        </div>`);
    }

    const modal   = document.getElementById('revision-post-modal');
    const details = document.getElementById('rev-details');
    const errBox  = document.getElementById('rev-error');
    errBox.style.display = 'none';
    document.getElementById('rev-observacion').value = '';
    modal.style.display = 'flex';
    details.innerHTML   = '<div style="text-align:center; padding:1rem;"><i class="fa-solid fa-circle-notch fa-spin" style="color:var(--primary-color);"></i></div>';

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
                downloadBtn = `<a href="${sd.signedUrl}" target="_blank" class="btn btn-outline" style="display:inline-flex; align-items:center; gap:0.4rem; margin-top:0.5rem;"><i class="fa-solid fa-file-word" style="color:#2563EB;"></i> Descargar Word</a>`;
            }
        }
        const catClass = { 'Desarrollo':'badge-info', 'Propuesta':'badge-warning', 'Aplicado':'badge-success' };
        details.innerHTML = `
            <div style="display:grid; gap:0.6rem; padding:1rem; background:var(--bg-base); border-radius:8px;">
                <p><strong>Proyecto:</strong> ${escapeHTML(p.nombre)}</p>
                <p><strong>Estudiante:</strong> ${escapeHTML(p.estudiante?.nombre || '—')}</p>
                <p><strong>Categoría:</strong> <span class="badge ${catClass[p.categoria] || ''}">${escapeHTML(p.categoria)}</span></p>
                ${downloadBtn}
            </div>`;
    } catch (err) {
        console.error('abrirModalRevision Error:', err);
        details.innerHTML = `<p style="color:var(--status-danger);">Error al cargar los detalles.</p>`;
    }
}

function cerrarModalRevision() {
    const modal = document.getElementById('revision-post-modal');
    if (modal) modal.style.display = 'none';
    currentRevPostId   = null;
    currentRevPostData = null;
}

async function enviarRevision(decision) {
    if (!supabaseClient || !currentRevPostId || !currentRevPostData) return;
    const observacion = document.getElementById('rev-observacion').value.trim();
    const errBox = document.getElementById('rev-error');
    errBox.style.display = 'none';

    if (!observacion) {
        errBox.textContent = 'La observación es obligatoria.';
        errBox.style.display = 'block';
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
        errBox.style.display = 'block';
    }
}
