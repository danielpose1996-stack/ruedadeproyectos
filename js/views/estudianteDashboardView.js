function renderEstudianteDashboard() {
    setTimeout(() => {
        loadEstudianteDashboard();
    }, 100);

    return `
        <div style="max-width: 900px; margin: 3rem auto; padding: 0 1rem;">
            <a href="#" onclick="handleLogout(); return false;" style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; font-weight: 500; color: var(--status-danger);">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Cerrar Sesión
            </a>

            <h1 style="color: var(--primary-color); text-align: center; margin-bottom: 2rem;">Mis Proyectos Asignados</h1>
            
            <div id="estudiante-data-container">
                <div class="card" style="padding: 2.5rem; text-align: center; color: var(--text-secondary);">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                    <p>Buscando tus datos de evaluación...</p>
                </div>
            </div>
        </div>
    `;
}

async function loadEstudianteDashboard() {
    if(!supabaseClient || !currentProfile) return;
    
    const container = document.getElementById('estudiante-data-container');
    if (!container) return;

    try {
        // 1. Fetch projects assigned to this student
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
                </div>
            `;
            return;
        }

        // We will collect HTML strings for all assigned projects
        let htmlContent = '';
        const catClass = { 'Desarrollo': 'badge-info', 'Propuesta': 'badge-warning', 'Aplicación': 'badge-success' };

        for (const a of assignments) {
            const p = a.proyectos;
            if (!p) continue;

            if (p.estado !== 'Evaluado') {
                htmlContent += `
                    <div class="card" style="padding: 2.5rem; border-top: 5px solid var(--border-color); margin-bottom: 2rem;">
                        <h2 style="color: var(--text-primary); margin-bottom: 0.5rem;">${escapeHTML(p.nombre)}</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;"><strong>Categoría:</strong> <span class="badge ${catClass[p.categoria] || ''}">${p.categoria}</span></p>
                        <div style="margin-top: 2rem; padding: 1.5rem; background-color: var(--bg-surface-elevated); border-radius: 8px; text-align: center;">
                            <i class="fa-regular fa-clock" style="font-size: 2rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                            <p style="color: var(--text-secondary);">Este proyecto aún está en estado <strong>${p.estado}</strong> y no ha sido evaluado finalizado.</p>
                        </div>
                    </div>
                `;
            } else {
                // Use eagerly loaded evaluation details
                const evalDataList = p.evaluaciones || [];

                if (evalDataList.length > 0) {
                    // Calculate Average Score
                    const totalScore = evalDataList.reduce((acc, curr) => acc + parseFloat(curr.puntaje_final || 0), 0);
                    const avgScore = (totalScore / evalDataList.length).toFixed(1);

                    // Concatenate all observations
                    const allObservacionesHTML = evalDataList.map((evalItem) => {
                        const evalName = escapeHTML(evalItem.perfiles ? evalItem.perfiles.nombre : 'Desconocido');
                        const obs = escapeHTML(evalItem.observaciones || 'Sin observaciones.');
                        return `
                        <div style="background-color: var(--bg-surface-elevated); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 8px; color: var(--text-primary); margin-bottom: 1rem;">
                            <p>${obs.replace(/\n/g, '<br>')}</p>
                            <p style="margin-top: 1rem; text-align: right; color: var(--text-secondary); font-size: 0.9rem;">— Prof. ${evalName}</p>
                        </div>
                        `;
                    }).join('');

                    htmlContent += `
                        <div class="card" style="padding: 2.5rem; border-top: 5px solid var(--primary-color); margin-bottom: 2rem;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem;">
                                <div>
                                    <h2 style="color: var(--text-primary); margin-bottom: 0.5rem;">${escapeHTML(p.nombre)}</h2>
                                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem;"><strong>Categoría:</strong> <span class="badge ${catClass[p.categoria] || ''}">${p.categoria}</span></p>
                                    <p style="color: var(--text-secondary);"><strong>Periodo:</strong> Semestre ${p.semestre} - ${p.anio}</p>
                                </div>
                                <div style="text-align: right;">
                                    <div style="background-color: var(--primary-light); color: var(--primary-color); padding: 1rem 1.5rem; border-radius: 8px; display: inline-block; text-align: center;">
                                        <span style="display: block; font-size: 0.8rem; text-transform: uppercase; font-weight: 600; margin-bottom: 0.2rem;">Puntaje Promedio</span>
                                        <span style="font-size: 2.5rem; font-weight: 700; line-height: 1;">${avgScore}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 style="color: var(--text-primary); margin-bottom: 1rem;"><i class="fa-solid fa-comment-dots" style="color: var(--primary-color);"></i> Observaciones de los Evaluadores</h3>
                                ${allObservacionesHTML}
                            </div>
                        </div>
                    `;
                } else {
                    htmlContent += `
                        <div class="card" style="padding: 2.5rem; border-top: 5px solid var(--border-color); margin-bottom: 2rem;">
                            <h2 style="color: var(--text-primary); margin-bottom: 0.5rem;">${escapeHTML(p.nombre)}</h2>
                            <p style="color: var(--status-danger);">El proyecto figura como evaluado pero no se encontraron los detalles de la evaluación.</p>
                        </div>
                    `;
                }
            }
        }

        container.innerHTML = htmlContent;

    } catch (e) {
        console.error("loadEstudianteDashboard Error:", e);
        container.innerHTML = `
            <div class="card" style="padding: 2.5rem; text-align: center; color: var(--status-danger);">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Ocurrió un error al cargar la información de tus proyectos.</p>
            </div>
        `;
    }
}
