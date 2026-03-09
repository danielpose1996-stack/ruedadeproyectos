function renderResultsView() {
    setTimeout(() => {
        loadHistoricalRankings();
    }, 100);

    return `
        <div style="max-width: 1200px; margin: 3rem auto; padding: 0 1rem;">
            
            <div style="text-align: center; margin-bottom: 3rem;">
                <h1 style="color: var(--primary-color); font-size: 2.5rem; margin-bottom: 0.5rem;">Resultados Históricos</h1>
                <p style="color: var(--text-secondary); font-size: 1.1rem;">Consulta el ranking de los mejores proyectos por año, semestre y categoría.</p>
            </div>

            <!-- Filters -->
            <div class="filters-bar" style="background-color: var(--bg-surface); padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; margin-bottom: 2rem;">
                <div class="filter-group" style="flex: 1; min-width: 200px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Año</label>
                    <select id="filter-year" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                </div>
                <div class="filter-group" style="flex: 1; min-width: 200px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Semestre</label>
                    <select id="filter-semester" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                        <option value="1">1 (Primer Semestre)</option>
                        <option value="2">2 (Segundo Semestre)</option>
                    </select>
                </div>
                <div class="filter-group" style="flex: 1; min-width: 200px;">
                    <label style="display: block; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 500;">Categoría</label>
                    <select id="filter-category" style="width: 100%; padding: 0.8rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-base); color: var(--text-primary);">
                        <option value="Desarrollo">Desarrollo</option>
                        <option value="Propuesta">Propuesta</option>
                        <option value="Aplicación">Aplicación</option>
                    </select>
                </div>
                <div style="display: flex; align-items: flex-end;">
                    <button class="btn btn-primary" style="height: 45px; padding: 0 2rem;" onclick="loadHistoricalRankings()"><i class="fa-solid fa-filter"></i> Filtrar</button>
                </div>
            </div>

            <!-- Top 5 Ranking Container -->
            <div id="results-data-container">
                <div class="card" style="padding: 2.5rem; text-align: center; color: var(--text-secondary);">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                    <p>Cargando ranking histórico...</p>
                </div>
            </div>
            
        </div>
    `;
}

// --- HISTORICAL RANKINGS LOGIC ---
async function loadHistoricalRankings() {
    if(!supabaseClient) return;

    const container = document.getElementById('results-data-container');
    const bgContainer = document.querySelector('.results-preview-section');
    if (!container && !bgContainer) return;

    const year = document.getElementById('filter-year')?.value || new Date().getFullYear().toString();
    const semester = document.getElementById('filter-semester')?.value || '1';
    const category = document.getElementById('filter-category')?.value || 'Desarrollo';

    try {
        if(container) {
            container.innerHTML = `
                <div class="card" style="padding: 2.5rem; text-align: center; color: var(--text-secondary);">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; margin-bottom: 1rem; color: var(--primary-color);"></i>
                    <p>Cargando ranking histórico...</p>
                </div>
            `;
        }

        const { data: proyectos, error: pErr } = await supabaseClient
            .from('proyectos')
            .select(`
                id, nombre, categoria, semestre, anio, estado,
                evaluaciones ( puntaje_final ),
                proyecto_estudiantes (
                    perfiles ( nombre )
                )
            `)
            .eq('estado', 'Evaluado')
            .eq('anio', year)
            .eq('semestre', semester)
            .eq('categoria', category);

        if (pErr) throw pErr;

        let rankedProjects = proyectos.map(p => {
            let avgScore = 0;
            if (p.evaluaciones && p.evaluaciones.length > 0) {
                const totalScore = p.evaluaciones.reduce((acc, curr) => acc + parseFloat(curr.puntaje_final || 0), 0);
                avgScore = parseFloat((totalScore / p.evaluaciones.length).toFixed(1));
            }
            
            let studentsText = 'Anónimo';
            if (p.proyecto_estudiantes && p.proyecto_estudiantes.length > 0) {
                studentsText = p.proyecto_estudiantes.map(pe => pe.perfiles?.nombre).join(', ');
            }

            return {
                id: p.id,
                nombre: escapeHTML(p.nombre),
                students: escapeHTML(studentsText),
                score: avgScore
            };
        });

        rankedProjects.sort((a, b) => b.score - a.score);
        const top5 = rankedProjects.slice(0, 5);

        if (!container) return;

        if (top5.length === 0) {
            container.innerHTML = `
                <div class="card" style="padding: 3rem; text-align: center; color: var(--text-secondary);">
                    <i class="fa-solid fa-ranking-star" style="font-size: 3rem; margin-bottom: 1rem; color: #cbd5e1;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No hay proyectos evaluados</h3>
                    <p>Aún no existen proyectos evaluados para <strong>${category}</strong> en el periodo <strong>${year}-${semester}</strong>.</p>
                </div>
            `;
            return;
        }

        let tableRowsHtml = top5.map((p, index) => {
            const rankClass = index === 0 ? 'rank-1' : (index === 1 ? 'rank-2' : (index === 2 ? 'rank-3' : ''));
            return `
                <tr>
                    <td style="display: flex; justify-content: center;">
                        <div class="rank-badge ${rankClass}">${index + 1}</div>
                    </td>
                    <td><strong>${p.nombre}</strong></td>
                    <td>${p.students}</td>
                    <td style="text-align: right; font-weight: 700; color: var(--primary-color); font-size: 1.2rem;">
                        ${p.score.toFixed(1)}
                    </td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <div class="card" style="padding: 2rem;">
                <h2 style="color: var(--text-primary); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-trophy" style="color: #F59E0B;"></i> Top 5 - Categoría: ${category} (${year}-${semester})
                </h2>
                
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 80px; text-align: center;">Rank</th>
                                <th>Nombre del Proyecto</th>
                                <th>Integrantes</th>
                                <th style="text-align: right;">Puntaje Final</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHtml}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

    } catch (e) {
        console.error("loadHistoricalRankings Error:", e);
        if(container) {
            container.innerHTML = `
                <div class="card" style="padding: 2.5rem; text-align: center; color: var(--status-danger);">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>Ocurrió un error al cargar el ranking histórico.</p>
                </div>
            `;
        }
    }
}
