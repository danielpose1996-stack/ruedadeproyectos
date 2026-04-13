import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import ConfirmModal from '../components/ui/ConfirmModal'
import { escapeHTML } from '../utils/helpers'
import { CATEGORY_STYLES } from '../utils/constants'

const RUBRIC_CRITERIA = [
  { name: 'Planteamiento del problema', levels: ['El problema no está claramente definido. Carece de contexto y delimitación.','El problema se describe de forma general, con contexto limitado y delimitación parcial.','Problema claro, contextualizado y delimitado. Se entiende la necesidad tecnológica.','Problema formulado con alta precisión, delimitación rigurosa y sólida contextualización técnica.'] },
  { name: 'Justificación', levels: ['No se sustenta la importancia del proyecto. Argumentos débiles o inexistentes.','Justificación general con argumentos básicos de relevancia.','Justificación clara con sustento académico y pertinencia tecnológica.','Justificación sólida y convincente. Evidencia impacto académico, tecnológico, y social.'] },
  { name: 'Objetivo general', levels: ['No está formulado correctamente o no se relaciona con el problema.','Objetivo comprensible pero con redacción débil o alineación parcial.','Objetivo claro, bien redactado y alineado con el problema.','Objetivo preciso, medible y perfectamente alineado. Redacción técnica rigurosa.'] },
  { name: 'Objetivos específicos', levels: ['No se presentan o no contribuyen al objetivo general. Verbos inadecuados.','Presenta objetivos pero con debilidades de redacción o secuencia lógica.','Objetivos claros, medibles y coherentes con el objetivo general.','Objetivos bien estructurados, medibles y metodológicamente coherentes. Define ruta clara.'] },
  { name: 'Estado del arte / Antecedentes', levels: ['No presenta antecedentes o son irrelevantes. Sin soporte académico.','Presenta antecedentes básicos con poca profundidad o escasas fuentes.','Revisión adecuada de trabajos previos relevantes al tema.','Análisis crítico de antecedentes científicos y tecnológicos con fuentes actualizadas.'] },
  { name: 'Metodología de desarrollo propuesta', levels: ['No define cómo se construirá la solución tecnológica.','Describe de forma general el proceso de desarrollo.','Metodología clara con fases definidas y coherentes al tipo de proyecto.','Metodología rigurosa, estructurada y alineada con estándares (ágiles o tradicionales).'] },
  { name: 'Metodología de investigación propuesta', levels: ['No identifica enfoque ni diseño metodológico.','Presenta enfoque básico con descripción limitada.','Define enfoque, tipo y diseño de investigación de forma adecuada.','Fundamentación metodológica sólida, coherente y plenamente justificada.'] },
  { name: 'Viabilidad del proyecto', levels: ['No analiza factibilidad técnica, económica ni operativa.','Análisis superficial de viabilidad con poca evidencia.','Viabilidad clara en términos técnicos y operativos.','Evaluación integral de viabilidad técnica, económica, operativa y temporal.'] },
  { name: 'Claridad de la presentación', levels: ['Exposición desorganizada, poco clara y sin estructura lógica.','Presentación comprensible pero con fallas de orden o claridad.','Presentación clara, ordenada y con buena estructura argumentativa.','Presentación fluida, profesional, bien estructurada y con dominio del tema.'] },
]

export default function EvaluacionPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()

  const [projectData, setProjectData] = useState(null)
  const [scores, setScores] = useState(RUBRIC_CRITERIA.map(() => 0))
  const [observations, setObservations] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60)
  const timerRef = useRef(null)

  const finalScore = scores.reduce((a, b) => a + b, 0) / scores.length

  useEffect(() => {
    loadProject()
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [projectId])

  async function loadProject() {
    if (!projectId) return
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select(`*, proyecto_estudiantes ( perfiles (nombre) )`)
        .eq('id', projectId)
        .single()
      if (error) throw error
      setProjectData(data)
    } catch (e) {
      console.error('Error loading project:', e)
    }
  }

  function handleScoreChange(index, value) {
    let v = parseFloat(value) || 0
    if (v > 5) v = 5
    if (v < 0) v = 0
    const newScores = [...scores]
    newScores[index] = v
    setScores(newScores)
  }

  async function handleSubmit() {
    if (finalScore < 1.0) {
      alert('Debe calificar todos los criterios. El puntaje mínimo es 1.0')
      return
    }
    setSubmitting(true)
    try {
      const rubricData = scores.map((s, i) => ({ criterioIndex: i + 1, puntaje: s }))
      const { error: evalErr } = await supabase.from('evaluaciones').insert([{
        proyecto_id: projectId,
        evaluador_id: profile.id,
        puntaje_final: parseFloat(finalScore.toFixed(1)),
        observaciones: escapeHTML(observations),
        rubrica_detalle: rubricData,
      }])
      if (evalErr) throw evalErr

      const { data: assignedData } = await supabase.from('proyecto_evaluadores').select('evaluador_id', { count: 'exact' }).eq('proyecto_id', projectId)
      const { data: evalsData } = await supabase.from('evaluaciones').select('evaluador_id', { count: 'exact' }).eq('proyecto_id', projectId)

      if (evalsData.length >= assignedData.length && assignedData.length > 0) {
        await supabase.from('proyectos').update({ estado: 'Evaluado' }).eq('id', projectId)
      }

      clearInterval(timerRef.current)
      setShowConfirm(false)
      alert('¡Evaluación enviada con éxito!')
      navigate('/dashboard/docente')
    } catch (e) {
      console.error('submitEvaluation Error:', e)
      alert('Ocurrió un error al enviar la calificación.')
    } finally {
      setSubmitting(false)
    }
  }

  const h = Math.floor(timeRemaining / 3600)
  const m = Math.floor((timeRemaining % 3600) / 60)
  const s = timeRemaining % 60
  const timerStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`

  const studentsText = projectData?.proyecto_estudiantes?.map(pe => pe.perfiles?.nombre).join(', ') || 'Sin asignar'

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-6">
      <button onClick={() => navigate('/dashboard/docente')} className="inline-flex items-center gap-2 mb-8 text-primary font-bold hover:translate-x-1 transition-transform group">
        <i className="fa-solid fa-arrow-left opacity-50 group-hover:opacity-100"></i> Volver al Dashboard
      </button>

      {/* Header Card */}
      <div className="bg-surface rounded-[40px] p-8 md:p-10 shadow-premium border border-border-color mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
          <div className="space-y-6 flex-grow">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Evaluación en progreso</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                {projectData?.nombre || 'Cargando proyecto...'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary shadow-sm"><i className="fa-solid fa-tags"></i></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Categoría</p>
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${CATEGORY_STYLES[projectData?.categoria] || 'bg-slate-100 text-slate-700'}`}>
                    {projectData?.categoria || 'Cargando...'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm"><i className="fa-solid fa-users"></i></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Integrantes</p>
                  <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{studentsText}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-end justify-center">
            <div className="bg-slate-900 rounded-[32px] p-8 text-center shadow-xl shadow-slate-900/20 border border-slate-800 lg:min-w-[240px]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Tiempo Restante</p>
              <div className="text-4xl font-mono font-black text-white tracking-widest">{timerStr}</div>
              <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"><div className="bg-primary h-full w-full opacity-60"></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Rubric Table */}
      <div className="bg-surface rounded-[40px] border border-border-color shadow-sm overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-border-color">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[25%] text-center">Criterio</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">1.0 – 2.9<br/><span className="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">No cumple</span></th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">3.0 – 3.9<br/><span className="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">Básico</span></th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">4.0 – 4.4<br/><span className="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">Bueno</span></th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[15%]">4.5 – 5.0<br/><span className="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">Excelente</span></th>
                <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em] w-[15%] text-right">Calificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color text-sm">
              {RUBRIC_CRITERIA.map((criterion, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-slate-200 group-hover:bg-primary transition-colors rounded-full"></div>
                      <strong className="text-slate-700 font-bold leading-tight">{criterion.name}</strong>
                    </div>
                  </td>
                  {criterion.levels.map((level, li) => (
                    <td key={li} className={`px-6 py-6 text-[11px] text-slate-500 italic leading-relaxed ${li > 0 ? 'border-l border-slate-50' : ''}`}>{level}</td>
                  ))}
                  <td className="px-8 py-6 text-right">
                    <div className="inline-flex flex-col items-end">
                      <input
                        type="number" min="1" max="5" step="0.1"
                        className="w-20 px-4 py-3 bg-bg-base border-2 border-slate-100 rounded-xl text-center font-black text-lg text-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
                        value={scores[idx] || ''}
                        onChange={e => handleScoreChange(idx, e.target.value)}
                      />
                      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Nota 1.0-5.0</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-3xl p-8 border border-border-color shadow-sm h-full">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Observaciones y Retroalimentación General</label>
            <textarea
              className="w-full h-48 p-6 bg-bg-base border border-border-color rounded-2xl text-slate-700 font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none shadow-sm"
              placeholder="Proporcione una retroalimentación constructiva indicando fortalezas, debilidades y sugerencias de mejora pedagógica y técnica..."
              value={observations}
              onChange={e => setObservations(e.target.value)}
            />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-3xl p-10 flex flex-col justify-between h-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Puntaje Final</p>
              <h3 className="text-white font-black text-xl mb-4">Promedio General</h3>
              <div className="text-7xl font-black text-primary tracking-tighter mb-8">{finalScore.toFixed(1)}</div>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full py-6 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transform hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-paper-plane text-xs opacity-50"></i> Enviar Evaluación
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSubmit}
        title="Confirmar Envío"
        message={<>¿Está seguro de enviar esta calificación? Una vez enviada <strong className="text-slate-700">no podrá modificarse</strong> y se registrará formalmente en el sistema.</>}
        confirmText="Sí, enviar"
        cancelText="Retroceder"
        loading={submitting}
      />
    </div>
  )
}
