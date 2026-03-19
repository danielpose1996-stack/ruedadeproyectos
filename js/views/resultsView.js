function renderResultsView() {
    setTimeout(() => {
        loadHistoricalRankings();
    }, 100);

    return `
        <div class="max-w-6xl mx-auto py-12 px-4 md:px-6">
            
            <div class="text-center mb-16 space-y-4">
                <h1 class="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Resultados Históricos</h1>
                <p class="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Consulta el ranking de los mejores proyectos tecnológicos por año, semestre y categoría.</p>
                <div class="w-24 h-1.5 bg-primary mx-auto rounded-full opacity-20"></div>
            </div>

            <!-- Filters Bar -->
            <div class="bg-surface p-8 rounded-[32px] shadow-premium border border-border-color flex flex-wrap gap-6 items-end mb-12">
                <div class="flex-grow min-w-[180px] space-y-2">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Año Lectivo</label>
                    <div class="relative">
                        <select id="filter-year" class="w-full pl-6 pr-10 py-4 bg-bg-base border border-slate-100 rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer">
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                    </div>
                </div>
                <div class="flex-grow min-w-[180px] space-y-2">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Semestre</label>
                    <div class="relative">
                        <select id="filter-semester" class="w-full pl-6 pr-10 py-4 bg-bg-base border border-slate-100 rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer">
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                    </div>
                </div>
                <div class="flex-grow min-w-[180px] space-y-2">
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Categoría</label>
                    <div class="relative">
                        <select id="filter-category" class="w-full pl-6 pr-10 py-4 bg-bg-base border border-slate-100 rounded-2xl text-slate-700 font-bold appearance-none focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all cursor-pointer">
                            <option value="Desarrollo">Desarrollo</option>
                            <option value="Propuesta">Propuesta</option>
                            <option value="Aplicación">Aplicación</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                    </div>
                </div>
                <button class="bg-primary text-white font-black px-10 py-4 rounded-2xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2" 
                    onclick="loadHistoricalRankings()">
                    <i class="fa-solid fa-magnifying-glass text-sm opacity-50"></i> Buscar
                </button>
            </div>

            <!-- Ranking Content Container -->
            <div id="results-data-container" class="min-h-[400px]">
                <div class="flex flex-col items-center justify-center py-20 bg-surface rounded-[40px] border border-slate-100">
                    <i class="fa-solid fa-circle-notch fa-spin text-4xl text-primary opacity-40 mb-4"></i>
                    <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cargando Ranking Histórico</p>
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
                <div class="flex flex-col items-center justify-center py-20 bg-surface rounded-[40px] border border-slate-100">
                    <i class="fa-solid fa-circle-notch fa-spin text-4xl text-primary opacity-40 mb-4"></i>
                    <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cargando Ranking Histórico</p>
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
                <div class="bg-surface rounded-3xl p-16 text-center border border-slate-100 shadow-md">
                    <div class="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
                        <i class="fa-solid fa-ranking-star"></i>
                    </div>
                    <h3 class="text-xl font-black text-slate-800 mb-2">No hay proyectos evaluados</h3>
                    <p class="text-slate-500 font-medium">Aún no existen proyectos con evaluación completa para <strong class="text-primary">${escapeHTML(category)}</strong> en el periodo <strong class="text-slate-800">${escapeHTML(year)}-${escapeHTML(semester)}</strong>.</p>
                </div>
            `;
            return;
        }

        let tableRowsHtml = top5.map((p, index) => {
            const rankClasses = [
                'bg-amber-400 text-white shadow-lg shadow-amber-400/20',
                'bg-slate-300 text-white shadow-lg shadow-slate-300/20',
                'bg-amber-700 text-white shadow-lg shadow-amber-700/20',
                'bg-slate-100 text-slate-500',
                'bg-slate-100 text-slate-500'
            ];
            
            return `
                <tr class="hover:bg-slate-50/50 transition-colors group">
                    <td class="px-8 py-5">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg mx-auto ${rankClasses[index] || 'bg-slate-100'} ring-4 ring-white">
                            ${index + 1}
                        </div>
                    </td>
                    <td class="px-6 py-5">
                        <p class="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors leading-tight">${p.nombre}</p>
                    </td>
                    <td class="px-6 py-5">
                        <p class="text-sm font-medium text-slate-500 italic">${p.students}</p>
                    </td>
                    <td class="px-8 py-5 text-right">
                        <div class="inline-flex items-center gap-3">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline">Puntaje</span>
                            <span class="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center text-xl font-black shadow-sm ring-2 ring-white">
                                ${p.score.toFixed(1)}
                            </span>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <div class="bg-surface rounded-[40px] border border-slate-100 shadow-premium overflow-hidden">
                <div class="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-center gap-5">
                        <div class="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                            <i class="fa-solid fa-trophy"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Top Hall of Fame</h2>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${escapeHTML(category)} • Periodo ${escapeHTML(year)}-${escapeHTML(semester)}</p>
                        </div>
                    </div>
                    <div class="px-5 py-2 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Proyectos Evaluados
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr class="bg-slate-50/50">
                                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[150px] text-center">Posición</th>
                                <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Proyecto Ganador</th>
                                <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Equipo Innovador</th>
                                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
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
                <div class="bg-red-50 border-2 border-red-100 rounded-3xl p-10 text-center">
                    <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-status-danger text-2xl mx-auto mb-4 shadow-sm">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <p class="text-status-danger font-black text-sm uppercase tracking-widest">Error de Conexión</p>
                    <p class="text-red-400 text-sm mt-1">No se pudo recuperar el ranking histórico. Inténtelo de nuevo más tarde.</p>
                </div>
            `;
        }
    }
}
