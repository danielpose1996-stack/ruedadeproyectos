/**
 * estudianteDashboardView.js
 * Panel del estudiante: evaluaciones asignadas, postulación de proyectos, historial.
 */

function renderEstudianteDashboard() {
    const estudianteName = escapeHTML(currentProfile?.nombre || 'Estudiante');
    setTimeout(() => { estudianteShowTab('evaluaciones'); }, 100);

    return `
        <div class="dashboard-layout">
            <aside class="dashboard-sidebar">
                <div style="padding: 0 1rem 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1rem;">
                    <p style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Sesión activa</p>
                    <p style="font-weight: 600; color: var(--text-primary);">${estudianteName}</p>
                </div>
                <a href="#" class="sidebar-link active" id="sb-est-evaluaciones" onclick="estudianteShowTab('evaluaciones'); return false;"><i class="fa-solid fa-star-half-stroke"></i> Mis Evaluaciones</a>
                <a href="#" class="sidebar-link" id="sb-est-postular" onclick="estudianteShowTab('postular'); return false;"><i class="fa-solid fa-file-arrow-up"></i> Postular Proyecto</a>
                <a href="#" class="sidebar-link" id="sb-est-historial" onclick="estudianteShowTab('historial'); return false;"><i class="fa-solid fa-folder-clock"></i> Mis Postulaciones</a>
                <div style="margin-top: auto;">
                    <a href="#" onclick="handleLogout(); return false;" class="sidebar-link" style="color: var(--status-danger);"><i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar sesión</a>
                </div>
            </aside>

            <div class="dashboard-main">

                <!-- TAB: Evaluaciones -->
                <div id="est-tab-evaluaciones" style="display: block;">
                    <div class="dashboard-header">
                        <h1>Mis Proyectos Asignados</h1>
                    </div>
                    <div id="estudiante-data-container">
                        <div class="card" style="padding: 2.5rem; text-align: center; color: var(--text-secondary);">
                            <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                            <p>Buscando tus datos de evaluación...</p>
                        </div>
                    </div>
                </div>

                <!-- TAB: Postular Proyecto -->
                <div id="est-tab-postular" style="display: none;">
                    <div class="dashboard-header">
                        <div>
                            <h1>Postular Proyecto</h1>
                            <p style="color: var(--text-secondary);">Sube tu proyecto para revisión previa antes de la Rueda.</p>
                        </div>
                    </div>
                    <div class="card" style="padding: 2rem; max-width: 600px;">
                        <form id="form-postular" onsubmit="handlePostularProyecto(event)" style="display: flex; flex-direction: column; gap: 1.2rem;">
                            <div>
                                <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight:500; font-size:0.9rem;">Nombre del Proyecto *</label>
                                <input type="text" id="post-nombre" required placeholder="Ej. Sistema de monitoreo IoT para invernaderos"
                                    style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary); font-size:1rem; box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight:500; font-size:0.9rem;">Categoría *</label>
                                <select id="post-categoria" required style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-base); color:var(--text-primary); font-size:1rem;">
                                    <option value="">-- Selecciona una categoría --</option>
                                    <option value="Propuesta">Propuesta</option>
                                    <option value="Desarrollo">Desarrollo</option>
                                    <option value="Aplicado">Aplicado</option>
                                </select>
                            </div>
                            <div>
                                <label style="display:block; margin-bottom:0.4rem; color:var(--text-primary); font-weight:500; font-size:0.9rem;">Archivo Word (.doc / .docx) *</label>
                                <div style="border:2px dashed var(--border-color); border-radius:8px; padding:1.5rem; text-align:center; background:var(--bg-base); cursor:pointer;" onclick="document.getElementById('post-archivo').click()">
                                    <i class="fa-solid fa-cloud-arrow-up" style="font-size:2rem; color:var(--primary-color); margin-bottom:0.5rem; display:block;"></i>
                                    <p style="color:var(--text-secondary); margin-bottom:0.3rem;">Haz clic para seleccionar el archivo</p>
                                    <p id="post-archivo-nombre" style="color:var(--text-primary); font-size:0.85rem; font-weight:500;">Ningún archivo seleccionado</p>
                                    <p style="color:var(--text-secondary); font-size:0.78rem; margin-top:0.3rem;">Máx. 10 MB</p>
                                </div>
                                <input type="file" id="post-archivo" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    required style="display:none"
                                    onchange="document.getElementById('post-archivo-nombre').textContent = this.files[0]?.name || 'Ningún archivo seleccionado'">
                            </div>
                            <div id="post-error" style="display:none; color:var(--status-danger); background:#FEE2E2; padding:0.75rem; border-radius:8px; font-size:0.9rem;"></div>
                            <div id="post-success" style="display:none; color:#065f46; background:#D1FAE5; padding:0.75rem; border-radius:8px; font-size:0.9rem;"></div>
                            <button type="submit" class="btn btn-primary" id="btn-postular" style="padding:0.9rem;">
                                <i class="fa-solid fa-paper-plane"></i> Enviar a Revisión
                            </button>
                        </form>
                    </div>
                </div>

                <!-- TAB: Mis Postulaciones -->
                <div id="est-tab-historial" style="display: none;">
                    <div class="dashboard-header">
                        <div>
                            <h1>Mis Postulaciones</h1>
                            <p style="color: var(--text-secondary);">Historial y estado de tus proyectos postulados.</p>
                        </div>
                    </div>
                    <div id="historial-postulaciones-container">
                        <div class="card" style="padding:2rem; text-align:center; color:var(--text-secondary);">
                            <i class="fa-solid fa-circle-notch fa-spin" style="font-size:2rem; color:var(--primary-color);"></i>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
}

function estudianteShowTab(tabName) {
    const tabs = ['evaluaciones', 'postular', 'historial'];
    tabs.forEach(t => {
        const el = document.getElementById(`est-tab-${t}`);
        const link = document.getElementById(`sb-est-${t}`);
        if (el) el.style.display = (t === tabName) ? 'block' : 'none';
        if (link) {
            if (t === tabName) link.classList.add('active');
            else link.classList.remove('active');
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
    errBox.style.display = 'none';
    okBox.style.display  = 'none';
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Subiendo...';

    const nombre    = document.getElementById('post-nombre').value.trim();
    const categoria = document.getElementById('post-categoria').value;
    const archivo   = document.getElementById('post-archivo').files[0];

    if (!archivo) {
        errBox.textContent = 'Por favor selecciona un archivo Word.';
        errBox.style.display = 'block';
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar a Revisión';
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
        document.getElementById('post-archivo-nombre').textContent = 'Ningún archivo seleccionado';
        okBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Proyecto enviado exitosamente! El administrador revisará tu postulación pronto.';
        okBox.style.display = 'block';

    } catch (err) {
        console.error('handlePostularProyecto Error:', err);
        errBox.textContent = 'Error al subir el proyecto: ' + (err.message || 'Error desconocido');
        errBox.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar a Revisión';
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
                <div class="card" style="padding:2.5rem; text-align:center; color:var(--text-secondary);">
                    <i class="fa-solid fa-folder-open" style="font-size:3rem; margin-bottom:1rem; color:#cbd5e1;"></i>
                    <p style="font-size:1.1rem;">Aún no has postulado ningún proyecto.</p>
                    <button class="btn btn-primary" onclick="estudianteShowTab('postular')" style="margin-top:1rem;">Postular ahora</button>
                </div>`;
            return;
        }

        const estadoConfig = {
            'Pendiente de revisión': { badge: 'badge-warning', icon: 'fa-clock' },
            'En revisión':           { badge: 'badge-info',    icon: 'fa-magnifying-glass' },
            'Aprobado':              { badge: 'badge-success', icon: 'fa-circle-check' },
            'No aprobado':           { badge: 'badge-danger',  icon: 'fa-circle-xmark' }
        };

        container.innerHTML = data.map(p => {
            const cfg   = estadoConfig[p.estado] || { badge: '', icon: 'fa-question' };
            const fecha = new Date(p.created_at).toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' });
            const revisor = p.revisor?.nombre
                ? `<p style="color:var(--text-secondary); font-size:0.85rem; margin-top:0.2rem;"><strong>Revisor:</strong> ${escapeHTML(p.revisor.nombre)}</p>` : '';
            const obs = p.observacion_docente
                ? `<div style="margin-top:1rem; padding:0.9rem; background:var(--bg-surface-elevated); border-radius:8px; border-left:3px solid var(--primary-color);">
                        <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.3rem;"><strong>Observación del revisor:</strong></p>
                        <p style="color:var(--text-primary);">${escapeHTML(p.observacion_docente)}</p>
                   </div>` : '';

            return `
                <div class="card" style="padding:1.5rem; margin-bottom:1rem;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem;">
                        <div>
                            <h3 style="color:var(--text-primary); margin-bottom:0.2rem;">${escapeHTML(p.nombre)}</h3>
                            <p style="color:var(--text-secondary); font-size:0.85rem;"><strong>Categoría:</strong> ${escapeHTML(p.categoria)} &nbsp;·&nbsp; <strong>Enviado:</strong> ${fecha}</p>
                            ${revisor}
                        </div>
                        <span class="badge ${cfg.badge}"><i class="fa-solid ${cfg.icon}"></i> ${escapeHTML(p.estado)}</span>
                    </div>
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
                <div class="card" style="padding: 2.5rem; text-align: center; color: var(--text-secondary);">
                    <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; color: #cbd5e1;"></i>
                    <p style="font-size: 1.1rem;">No tienes proyectos asignados actualmente.</p>
                </div>`;
            return;
        }

        let htmlContent = '';
        const catClass = { 'Desarrollo': 'badge-info', 'Propuesta': 'badge-warning', 'Aplicación': 'badge-success' };

        for (const a of assignments) {
            const p = a.proyectos;
            if (!p) continue;

            if (p.estado !== 'Evaluado') {
                htmlContent += `
                    <div class="card" style="padding: 2.5rem; border-top: 5px solid var(--border-color); margin-bottom: 2rem;">
                        <h2 style="color: var(--text-primary); margin-bottom: 0.5rem;">${escapeHTML(p.nombre)}</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;"><strong>Categoría:</strong> <span class="badge ${catClass[p.categoria] || ''}">${escapeHTML(p.categoria)}</span></p>
                        <div style="margin-top: 2rem; padding: 1.5rem; background-color: var(--bg-surface-elevated); border-radius: 8px; text-align: center;">
                            <i class="fa-regular fa-clock" style="font-size: 2rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                            <p style="color: var(--text-secondary);">Este proyecto aún está en estado <strong>${escapeHTML(p.estado)}</strong>.</p>
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
                            <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-color); padding:1.5rem; border-radius:8px; margin-bottom:1rem;">
                                <p>${obs.replace(/\n/g,'<br>')}</p>
                                <p style="margin-top:1rem; text-align:right; color:var(--text-secondary); font-size:0.9rem;">— Prof. ${evalName}</p>
                            </div>`;
                    }).join('');
                    htmlContent += `
                        <div class="card" style="padding: 2.5rem; border-top: 5px solid var(--primary-color); margin-bottom: 2rem;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:2rem; border-bottom:1px solid var(--border-color); padding-bottom:1.5rem;">
                                <div>
                                    <h2 style="color:var(--text-primary); margin-bottom:0.5rem;">${escapeHTML(p.nombre)}</h2>
                                    <p style="color:var(--text-secondary); margin-bottom:0.5rem;"><strong>Categoría:</strong> <span class="badge ${catClass[p.categoria] || ''}">${escapeHTML(p.categoria)}</span></p>
                                    <p style="color:var(--text-secondary);"><strong>Periodo:</strong> Semestre ${escapeHTML(p.semestre)} - ${escapeHTML(p.anio)}</p>
                                </div>
                                <div style="background:var(--primary-light); color:var(--primary-color); padding:1rem 1.5rem; border-radius:8px; text-align:center;">
                                    <span style="display:block; font-size:0.8rem; text-transform:uppercase; font-weight:600; margin-bottom:0.2rem;">Puntaje Promedio</span>
                                    <span style="font-size:2.5rem; font-weight:700; line-height:1;">${avgScore}</span>
                                </div>
                            </div>
                            <h3 style="margin-bottom:1rem;"><i class="fa-solid fa-comment-dots" style="color:var(--primary-color);"></i> Observaciones</h3>
                            ${allObsHTML}
                        </div>`;
                }
            }
        }
        container.innerHTML = htmlContent;

    } catch (e) {
        console.error('loadEstudianteDashboard Error:', e);
        container.innerHTML = `
            <div class="card" style="padding: 2.5rem; text-align: center; color: var(--status-danger);">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Ocurrió un error al cargar la información de tus proyectos.</p>
            </div>`;
    }
}
