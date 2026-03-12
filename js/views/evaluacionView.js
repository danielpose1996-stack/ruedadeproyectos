function renderEvaluacionView() {
    return `
        <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem;">
            
            <a href="#" onclick="navigateTo('dashboard-docente'); return false;" style="display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-weight: 500;">
                <i class="fa-solid fa-arrow-left"></i> Volver al Dashboard
            </a>

            <!-- Evaluation Header -->
            <div class="eval-header">
                <div class="eval-info">
                    <h2>Sistema IoT para Invernaderos Inteligentes</h2>
                    <p><strong>Categoría:</strong> <span class="badge badge-info">Desarrollo</span></p>
                    <p><strong>Integrantes:</strong> Ana López, Luis Perez</p>
                    <p><strong>Evaluador:</strong> Prof. Carlos Martínez</p>
                    <p><strong>Periodo:</strong> 2026-1</p>
                </div>
                <div class="timer-box">
                    <p>Tiempo Restante</p>
                    <div class="time" id="eval-timer">24:00:00</div>
                </div>
            </div>

            <!-- Rubric Table -->
            <div style="overflow-x: auto;">
                <table class="rubric-table">
                    <thead>
                        <tr>
                            <th style="width: 20%;">Criterio de Evaluación</th>
                            <th style="width: 20%;">1.0 – 2.9  No cumple</th>
                            <th style="width: 20%;">3.0 – 3.9  Cumplimiento básico</th>
                            <th style="width: 20%;">4.0 – 4.4  Buen nivel</th>
                            <th style="width: 20%;">4.5 – 5.0  Excelente</th>
                            <th style="width: 10%;">Nota (1-5)</th>
                        </tr>
                    </thead>
                    <tbody id="rubric-form">
                        <tr>
                            <td><strong>Planteamiento del problema</strong></td>
                            <td>El problema no está claramente definido. Carece de contexto y delimitación.</td>
                            <td>El problema se describe de forma general, con contexto limitado y delimitación parcial.</td>
                            <td>Problema claro, contextualizado y delimitado. Se entiende la necesidad tecnológica.</td>
                            <td>Problema formulado con alta precisión, delimitación rigurosa y sólida contextualización técnica.</td>
                            <td><input type="number" min="1" max="5" step="0.1" class="rubric-input" value="0.0"></td>
                        </tr>
                        <tr>
                            <td><strong>Justificación</strong></td>
                            <td>No se sustenta la importancia del proyecto. Argumentos débiles o inexistentes.</td>
                            <td>Justificación general con argumentos básicos de relevancia.</td>
                            <td>Justificación clara con sustento académico y pertinencia tecnológica.</td>
                            <td>Justificación sólida y convincente. Evidencia impacto académico, tecnológico, y social.</td>
                            <td><input type="number" min="1" max="5" step="0.1" class="rubric-input" value="0.0"></td>
                        </tr>
                        <tr>
                            <td><strong>Objetivo general</strong></td>
                            <td>No está formulado correctamente o no se relaciona con el problema.</td>
                            <td>Objetivo comprensible pero con redacción débil o alineación parcial.</td>
                            <td>Objetivo claro, bien redactado y alineado con el problema.</td>
                            <td>Objetivo preciso, medible y perfectamente alineado. Redacción técnica rigurosa.</td>
                            <td><input type="number" min="1" max="5" step="0.1" class="rubric-input" value="0.0"></td>
                        </tr>
                        <tr>
                            <td><strong>Objetivos específicos</strong></td>
                            <td>No se presentan o no contribuyen al objetivo general. Verbos inadecuados.</td>
                            <td>Presenta objetivos pero con debilidades de redacción o secuencia lógica.</td>
                            <td>Objetivos claros, medibles y coherentes con el objetivo general.</td>
                            <td>Objetivos bien estructurados, medibles y metodológicamente coherentes. Define ruta clara.</td>
                            <td><input type="number" min="1" max="5" step="0.1" class="rubric-input" value="0.0"></td>
                        </tr>
                        <tr>
                            <td><strong>Estado del arte / Antecedentes</strong></td>
                            <td>No presenta antecedentes o son irrelevantes. Sin soporte académico.</td>
                            <td>Presenta antecedentes básicos con poca profundidad o escasas fuentes.</td>
                            <td>Revisión adecuada de trabajos previos relevantes al tema.</td>
                            <td>Análisis crítico de antecedentes científicos y tecnológicos con fuentes actualizadas.</td>
                            <td><input type="number" min="1" max="5" step="0.1" class="rubric-input" value="0.0"></td>
                        </tr>
                        <tr>
                            <td><strong>Metodología de desarrollo propuesta</strong></td>
                            <td>No define cómo se construirá la solución tecnológica.</td>
                            <td>Describe de forma general el proceso de desarrollo.</td>
                            <td>Metodología clara con fases definidas y coherentes al tipo de proyecto.</td>
                            <td>Metodología rigurosa, estructurada y alineada con estándares (ágiles o tradicionales).</td>
                            <td><input type="number" min="1" max="5" step="0.1" class="rubric-input" value="0.0"></td>
                        </tr>
                        <tr>
                            <td><strong>Metodología de investigación propuesta</strong></td>
                            <td>No identifica enfoque ni diseño metodológico.</td>
                            <td>Presenta enfoque básico con descripción limitada.</td>
                            <td>Define enfoque, tipo y diseño de investigación de forma adecuada.</td>
                            <td>Fundamentación metodológica sólida, coherente y plenamente justificada.</td>
                            <td><input type="number" min="1" max="5" step="0.1" class="rubric-input" value="0.0"></td>
                        </tr>
                        <tr>
                            <td><strong>Viabilidad del proyecto</strong></td>
                            <td>No analiza factibilidad técnica, económica ni operativa.</td>
                            <td>Análisis superficial de viabilidad con poca evidencia.</td>
                            <td>Viabilidad clara en términos técnicos y operativos.</td>
                            <td>Evaluación integral de viabilidad técnica, económica, operativa y temporal.</td>
                            <td><input type="number" min="1" max="5" step="0.1" class="rubric-input" value="0.0"></td>
                        </tr>
                        <tr>
                            <td><strong>Claridad de la presentación</strong></td>
                            <td>Exposición desorganizada, poco clara y sin estructura lógica.</td>
                            <td>Presentación comprensible pero con fallas de orden o claridad.</td>
                            <td>Presentación clara, ordenada y con buena estructura argumentativa.</td>
                            <td>Presentación fluida, profesional, bien estructurada y con dominio del tema.</td>
                            <td><input type="number" min="1" max="5" step="0.1" class="rubric-input" value="0.0"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer: Observations and Submission -->
            <div class="eval-footer">
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Observaciones y Retroalimentación:</label>
                    <textarea class="observations" placeholder="Escriba aquí los comentarios, sugerencias de mejora y observaciones generales sobre el proyecto..."></textarea>
                </div>
                
                <div class="final-score-box">
                    <div>
                        <h3 style="color: var(--text-primary);">Calificación Final</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">Promedio automático de los criterios evaluados</p>
                    </div>
                    <div class="score-display" id="final-score">0.0</div>
                    <button class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;" onclick="showConfirmModal()">
                        <i class="fa-solid fa-paper-plane"></i> Enviar calificación
                    </button>
                </div>
            </div>
            
        </div>
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
                const catClass = { 'Desarrollo': 'badge-info', 'Propuesta': 'badge-warning', 'Aplicación': 'badge-success' };
                
                let studentsText = 'Sin asignar';
                if (pData.proyecto_estudiantes && pData.proyecto_estudiantes.length > 0) {
                    studentsText = pData.proyecto_estudiantes.map(pe => pe.perfiles?.nombre).join(', ');
                }

                // We need to inject these values into the renderEvaluacionView template which is already in DOM
                const headerHtml = `
                    <div>
                        <h1 style="color: var(--primary-color); font-size: 1.8rem; margin-bottom: 0.5rem;" id="eval-proj-title">${escapeHTML(pData.nombre)}</h1>
                        <p style="color: var(--text-secondary); margin-bottom: 0.5rem;"><strong>Categoría:</strong> <span class="badge ${catClass[pData.categoria] || ''}">${pData.categoria}</span></p>
                        <p style="color: var(--text-secondary);"><strong>Integrantes:</strong> ${escapeHTML(studentsText)}</p>
                    </div>
                `;
                
                // Replace the static header
                const headerContainer = document.querySelector('.eval-header > div:first-child');
                if (headerContainer) {
                    headerContainer.outerHTML = headerHtml;
                }
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
        <div class="modal-overlay active" id="confirm-modal">
            <div class="modal-content">
                <i class="fa-solid fa-triangle-exclamation modal-icon"></i>
                <h3 class="modal-title">Confirmar Envío</h3>
                <p style="color: var(--text-secondary);">¿Está seguro de enviar esta calificación? Una vez enviada <strong>no podrá modificarse</strong>.</p>
                <div class="modal-actions" style="margin-top: 1.5rem;">
                    <button class="btn btn-outline" onclick="closeModal()" id="btn-cancel-eval">Cancelar</button>
                    <button class="btn btn-primary" onclick="submitEvaluation()" id="btn-submit-eval">Sí, enviar</button>
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
                observaciones: observaciones,
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
