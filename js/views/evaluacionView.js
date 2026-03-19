function renderEvaluacionView() {
    return `
        <div class="max-w-6xl mx-auto py-8 px-4 md:px-6">
            
            <a href="#" onclick="navigateTo('dashboard-docente'); return false;" 
                class="inline-flex items-center gap-2 mb-8 text-primary font-bold hover:translate-x-1 transition-transform group">
                <i class="fa-solid fa-arrow-left opacity-50 group-hover:opacity-100"></i> Volver al Dashboard
            </a>

            <!-- Evaluation Header Card -->
            <div class="bg-surface rounded-[40px] p-8 md:p-10 shadow-premium border border-border-color mb-10 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                
                <div class="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                    <div class="space-y-6 flex-grow">
                        <div>
                            <p class="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Evaluación en progreso</p>
                            <h2 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight" id="eval-proj-title">Cargando proyecto...</h2>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary shadow-sm">
                                    <i class="fa-solid fa-tags"></i>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Categoría</p>
                                    <span id="eval-proj-cat-badge" class="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-lg">Cargando...</span>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                                    <i class="fa-solid fa-users"></i>
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Integrantes</p>
                                    <p class="text-sm font-bold text-slate-700 truncate max-w-[200px]" id="eval-proj-students">Cargando...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col items-center lg:items-end justify-center">
                        <div class="bg-slate-900 rounded-[32px] p-8 text-center shadow-xl shadow-slate-900/20 border border-slate-800 lg:min-w-[240px]">
                            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Tiempo Restante</p>
                            <div class="text-4xl font-mono font-black text-white tracking-widest" id="eval-timer">23:59:59</div>
                            <div class="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div class="bg-primary h-full w-full opacity-60"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rubric Grid -->
            <div class="bg-surface rounded-[40px] border border-border-color shadow-sm overflow-hidden mb-12">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr class="bg-slate-50 border-b border-border-color">
                                <th class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[25%] text-center">Criterio</th>
                                <th class="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">1.0 – 2.9<br><span class="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">No cumple</span></th>
                                <th class="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">3.0 – 3.9<br><span class="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">Básico</span></th>
                                <th class="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">4.0 – 4.4<br><span class="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">Bueno</span></th>
                                <th class="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">4.5 – 5.0<br><span class="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">Excelente</span></th>
                                <th class="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em] w-[15%] text-right">Calificación</th>
                            </tr>
                        </thead>
                        <tbody id="rubric-form" class="divide-y divide-border-color text-sm">
                            <!-- Rows will be injected or kept structure with Tailwind classes -->
                            ${renderRubricRow("Planteamiento del problema", 
                                "El problema no está claramente definido. Carece de contexto y delimitación.",
                                "El problema se describe de forma general, con contexto limitado y delimitación parcial.",
                                "Problema claro, contextualizado y delimitado. Se entiende la necesidad tecnológica.",
                                "Problema formulado con alta precisión, delimitación rigurosa y sólida contextualización técnica."
                            )}
                            ${renderRubricRow("Justificación", 
                                "No se sustenta la importancia del proyecto. Argumentos débiles o inexistentes.",
                                "Justificación general con argumentos básicos de relevancia.",
                                "Justificación clara con sustento académico y pertinencia tecnológica.",
                                "Justificación sólida y convincente. Evidencia impacto académico, tecnológico, y social."
                            )}
                            ${renderRubricRow("Objetivo general", 
                                "No está formulado correctamente o no se relaciona con el problema.",
                                "Objetivo comprensible pero con redacción débil o alineación parcial.",
                                "Objetivo claro, bien redactado y alineado con el problema.",
                                "Objetivo preciso, medible y perfectamente alineado. Redacción técnica rigurosa."
                            )}
                            ${renderRubricRow("Objetivos específicos", 
                                "No se presentan o no contribuyen al objetivo general. Verbos inadecuados.",
                                "Presenta objetivos pero con debilidades de redacción o secuencia lógica.",
                                "Objetivos claros, medibles y coherentes con el objetivo general.",
                                "Objetivos bien estructurados, medibles y metodológicamente coherentes. Define ruta clara."
                            )}
                            ${renderRubricRow("Estado del arte / Antecedentes", 
                                "No presenta antecedentes o son irrelevantes. Sin soporte académico.",
                                "Presenta antecedentes básicos con poca profundidad o escasas fuentes.",
                                "Revisión adecuada de trabajos previos relevantes al tema.",
                                "Análisis crítico de antecedentes científicos y tecnológicos con fuentes actualizadas."
                            )}
                            ${renderRubricRow("Metodología de desarrollo propuesta", 
                                "No define cómo se construirá la solución tecnológica.",
                                "Describe de forma general el proceso de desarrollo.",
                                "Metodología clara con fases definidas y coherentes al tipo de proyecto.",
                                "Metodología rigurosa, estructurada y alineada con estándares (ágiles o tradicionales)."
                            )}
                            ${renderRubricRow("Metodología de investigación propuesta", 
                                "No identifica enfoque ni diseño metodológico.",
                                "Presenta enfoque básico con descripción limitada.",
                                "Define enfoque, tipo y diseño de investigación de forma adecuada.",
                                "Fundamentación metodológica sólida, coherente y plenamente justificada."
                            )}
                            ${renderRubricRow("Viabilidad del proyecto", 
                                "No analiza factibilidad técnica, económica ni operativa.",
                                "Análisis superficial de viabilidad con poca evidencia.",
                                "Viabilidad clara en términos técnicos y operativos.",
                                "Evaluación integral de viabilidad técnica, económica, operativa y temporal."
                            )}
                            ${renderRubricRow("Claridad de la presentación", 
                                "Exposición desorganizada, poco clara y sin estructura lógica.",
                                "Presentación comprensible pero con fallas de orden o claridad.",
                                "Presentación clara, ordenada y con buena estructura argumentativa.",
                                "Presentación fluida, profesional, bien estructurada y con dominio del tema."
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Footer: Review Summary & Submission -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <div class="bg-surface rounded-3xl p-8 border border-border-color shadow-sm h-full">
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Observaciones y Retroalimentación General</label>
                        <textarea class="observations w-full h-48 p-6 bg-bg-base border border-border-color rounded-2xl text-slate-700 font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none shadow-sm" 
                            placeholder="Proporcione una retroalimentación constructiva indicando fortalezas, debilidades y sugerencias de mejora pedagógica y técnica..."></textarea>
                    </div>
                </div>
                
                <div class="lg:col-span-1">
                    <div class="bg-slate-900 rounded-3xl p-10 flex flex-col justify-between h-full shadow-2xl relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        
                        <div>
                            <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Puntaje Final</p>
                            <h3 class="text-white font-black text-xl mb-4">Promedio General</h3>
                            <div class="text-7xl font-black text-primary tracking-tighter mb-8" id="final-score">0.0</div>
                        </div>

                        <button onclick="showConfirmModal()" 
                            class="w-full py-6 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transform hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
                            <i class="fa-solid fa-paper-plane text-xs opacity-50"></i> Enviar Evaluación
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    `;
}

function renderRubricRow(criterion, c1, c2, c3, c4) {
    return `
        <tr class="hover:bg-slate-50/50 transition-colors group">
            <td class="px-8 py-6">
                <div class="flex items-center gap-3">
                    <div class="w-1.5 h-6 bg-slate-200 group-hover:bg-primary transition-colors rounded-full"></div>
                    <strong class="text-slate-700 font-bold leading-tight">${criterion}</strong>
                </div>
            </td>
            <td class="px-6 py-6 text-[11px] text-slate-500 italic leading-relaxed">${c1}</td>
            <td class="px-6 py-6 text-[11px] text-slate-500 italic leading-relaxed border-l border-slate-50">${c2}</td>
            <td class="px-6 py-6 text-[11px] text-slate-500 italic leading-relaxed border-l border-slate-50">${c3}</td>
            <td class="px-6 py-6 text-[11px] text-slate-500 italic leading-relaxed border-l border-slate-50">${c4}</td>
            <td class="px-8 py-6 text-right">
                <div class="inline-flex flex-col items-end">
                    <input type="number" min="1" max="5" step="0.1" class="rubric-input w-20 px-4 py-3 bg-bg-base border-2 border-slate-100 rounded-xl text-center font-black text-lg text-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm" value="0.0">
                    <p class="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Nota 1.0-5.0</p>
                </div>
            </td>
        </tr>
    `;
}

// --- EVALUATION INTERACTIVE LOGIC ---
let evalTimerInterval;
let currentEvaluationProjectId = null;

async function initEvaluacionLogic(projectId) {
    currentEvaluationProjectId = projectId;
    
    // Fetch real project data if available
    if (projectId && supabaseClient) {
        try {
            const { data: pData, error: pErr } = await supabaseClient
                .from('proyectos')
                .select(`
                    *,
                    proyecto_estudiantes (
                        perfiles (nombre)
                    )
                `)
                .eq('id', projectId)
                .single();
                
            if (pErr) throw pErr;
            if (pData) {
                // Update header DOM elements
                // Update header DOM elements
                const catClass = { 
                    'Desarrollo': 'bg-blue-100 text-blue-700', 
                    'Propuesta': 'bg-amber-100 text-amber-700', 
                    'Aplicación': 'bg-emerald-100 text-emerald-700',
                    'Aplicado': 'bg-emerald-100 text-emerald-700'
                };
                
                let studentsText = 'Sin asignar';
                if (pData.proyecto_estudiantes && pData.proyecto_estudiantes.length > 0) {
                    studentsText = pData.proyecto_estudiantes.map(pe => pe.perfiles?.nombre).join(', ');
                }

                const titleEl = document.getElementById('eval-proj-title');
                const catEl   = document.getElementById('eval-proj-cat-badge');
                const studEl  = document.getElementById('eval-proj-students');

                if (titleEl) titleEl.textContent = pData.nombre;
                if (catEl) {
                    catEl.textContent = pData.categoria;
                    catEl.className = `px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${catClass[pData.categoria] || 'bg-slate-100 text-slate-700'}`;
                }
                if (studEl) studEl.textContent = studentsText;
            }
        } catch (e) {
            console.error("Error loading project for evaluation:", e);
            alert("Ocurrió un error al cargar la información del proyecto.");
        }
    }

    // 1. Timer Start (24:00:00 = 1 día)
    clearInterval(evalTimerInterval);
    let timeRemaining = 24 * 60 * 60; // 1 día en segundos
    const timerEl = document.getElementById('eval-timer');
    
    evalTimerInterval = setInterval(() => {
        timeRemaining--;
        if(timeRemaining < 0) {
            clearInterval(evalTimerInterval);
            timerEl.style.color = "var(--status-danger)";
            return;
        }
        let h = Math.floor(timeRemaining / 3600);
        let m = Math.floor((timeRemaining % 3600) / 60);
        let s = timeRemaining % 60;
        timerEl.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);

    // 2. Auto-calc Score
    const inputs = document.querySelectorAll('.rubric-input');
    inputs.forEach(input => {
        input.addEventListener('input', updateFinalScore);
    });
}

function updateFinalScore() {
    const inputs = document.querySelectorAll('.rubric-input');
    let sum = 0;
    let count = 0;
    inputs.forEach(i => {
        let val = parseFloat(i.value) || 0;
        if(val > 5) { val = 5; i.value = 5; } // Clamp max
        if(val < 0) { val = 0; i.value = 0; } // Clamp min
        sum += val;
        count++;
    });
    const avg = sum / count;
    document.getElementById('final-score').innerText = avg.toFixed(1);
}

// --- MODAL LOGIC FOR EVALUATION ---
function showConfirmModal() {
    const finalScoreStr = document.getElementById('final-score').innerText;
    const finalScore = parseFloat(finalScoreStr);

    if (finalScore < 1.0) {
        alert("Debe calificar todos los criterios. El puntaje mínimo es 1.0");
        return;
    }

    const modalHTML = `
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[1000] flex justify-center items-center p-4" id="confirm-modal">
            <div class="bg-surface rounded-[40px] w-full max-w-[500px] shadow-2xl p-10 text-center animate-in zoom-in duration-300">
                <div class="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm border border-amber-100">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h3 class="text-2xl font-black text-slate-800 mb-4 tracking-tight">Confirmar Envío</h3>
                <p class="text-slate-500 font-medium leading-relaxed mb-10">¿Está seguro de enviar esta calificación? Una vez enviada <strong class="text-slate-700">no podrá modificarse</strong> y se registrará formalmente en el sistema.</p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <button class="flex-1 px-8 py-4 rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 transition-all uppercase tracking-widest text-xs" 
                        onclick="closeModal()" id="btn-cancel-eval">Retroceder</button>
                    <button class="flex-1 px-8 py-4 rounded-xl bg-primary text-white font-black hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all uppercase tracking-widest text-xs" 
                        onclick="submitEvaluation()" id="btn-submit-eval text-white">Sí, enviar</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('modals-container').innerHTML = modalHTML;
}

function closeModal() {
    document.getElementById('modals-container').innerHTML = '';
}

async function submitEvaluation() {
    if (!currentEvaluationProjectId || !supabaseClient || !currentProfile) {
        alert("Error de sesión o proyecto no seleccionado.");
        closeModal();
        return;
    }

    const btnSubmit = document.getElementById('btn-submit-eval');
    const btnCancel = document.getElementById('btn-cancel-eval');
    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Enviando...';
        btnCancel.disabled = true;
    }

    try {
        // Collect rubric data
        const inputs = document.querySelectorAll('.rubric-input');
        const rubricData = [];
        inputs.forEach((input, index) => {
            rubricData.push({
                criterioIndex: index + 1,
                puntaje: parseFloat(input.value) || 0
            });
        });

        const finalScore = parseFloat(document.getElementById('final-score').innerText);
        const observaciones = document.querySelector('.observations').value.trim();

        // 1. Insert evaluation record
        const { error: evalErr } = await supabaseClient
            .from('evaluaciones')
            .insert([{
                proyecto_id: currentEvaluationProjectId,
                evaluador_id: currentProfile.id,
                puntaje_final: finalScore,
                observaciones: escapeHTML(observaciones),
                rubrica_detalle: rubricData
            }]);

        if (evalErr) throw evalErr;

        // 2. Determine if ALL assigned evaluators have evaluated
        // Count how many evaluators are assigned to the project
        const { data: assignedData, error: assignedErr } = await supabaseClient
            .from('proyecto_evaluadores')
            .select('evaluador_id', { count: 'exact' })
            .eq('proyecto_id', currentEvaluationProjectId);
            
        if (assignedErr) throw assignedErr;
        const totalEvaluators = assignedData.length;

        // Count how many evaluations have been submitted for this project so far
        const { data: evalsData, error: evalsErr } = await supabaseClient
            .from('evaluaciones')
            .select('evaluador_id', { count: 'exact' })
            .eq('proyecto_id', currentEvaluationProjectId);
            
        if (evalsErr) throw evalsErr;
        const totalEvaluated = evalsData.length;

        // 3. Update project status ONLY if all have evaluated
        if (totalEvaluated >= totalEvaluators && totalEvaluators > 0) {
            const { error: updErr } = await supabaseClient
                .from('proyectos')
                .update({ estado: 'Evaluado' })
                .eq('id', currentEvaluationProjectId);

            if (updErr) throw updErr;
        }

        clearInterval(evalTimerInterval);
        closeModal();
        currentEvaluationProjectId = null;
        
        alert("¡Evaluación enviada con éxito!");
        navigateTo('dashboard-docente');

    } catch (e) {
        console.error("submitEvaluation Error:", e);
        alert("Ocurrió un error al enviar la calificación.");
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Sí, enviar';
            btnCancel.disabled = false;
        }
    }
}
