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
                            <!-- Avatar Column -->
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                                <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 4px solid var(--primary-color); background-color: var(--primary-light); color: var(--primary-color); display: flex; align-items: center; justify-content: center; font-size: 4rem; font-weight: bold; text-transform: uppercase;">
                                    ${docenteName.charAt(0)}
                                </div>
                            </div>
                            
                            <!-- User Info Column -->
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

            </div>
        </div>
    `;
}

// UI Function to switch tabs in Docente Dashboard
function docenteShowTab(tabName) {
    const tabs = ['pendientes', 'enviadas', 'perfil'];
    tabs.forEach(t => {
        const el = document.getElementById(`doc-tab-${t}`);
        const link = document.getElementById(`sb-doc-${t}`);
        if (el) el.style.display = t === tabName ? 'block' : 'none';
        if (link) {
            if (t === tabName) link.classList.add('active');
            else link.classList.remove('active');
        }
    });

    if (tabName === 'perfil') {
        // Enforce load of profile info specifically if requested
        loadDocenteProfileInfo();
    }
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
                        <td><span class="badge ${catClass[p.categoria] || ''}">${p.categoria}</span></td>
                        <td>${p.semestre}° / ${p.anio}</td>
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
                        <td><span class="badge ${catClass[p.categoria] || ''}">${p.categoria}</span></td>
                        <td>${p.semestre}° / ${p.anio}</td>
                        <td style="font-weight: 700; color: var(--primary-color);">
                            <span class="badge badge-success" style="margin-right: 0.5rem;">Enviado</span> ${score}
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
    // Only fetching is done here if needed. Avatar has been disabled.
    return;
}
