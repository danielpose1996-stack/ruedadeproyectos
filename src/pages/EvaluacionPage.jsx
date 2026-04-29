import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import ConfirmModal from '../components/ui/ConfirmModal'
import { escapeHTML } from '../utils/helpers'
import { CATEGORY_STYLES } from '../utils/constants'

const RUBRIC_CRITERIA = [
  { name: 'Título del proyecto', levels: ['El título no es claro ni descriptivo con lo que se quiere hacer en el proyecto. Utiliza más de 20 palabras y no guarda relación con el objetivo general ni con la pregunta problema.','El título es claro y descriptivo, no utiliza más de 20 palabras, aunque guarda poca relación con el objetivo general y la pregunta problema.','El título es claro y descriptivo, no utiliza más de 20 palabras y guarda relación con el objetivo general y la pregunta problema.'] },
  { name: 'Introducción', levels: ['El estudiante sigue la estructura básica de la introducción, pero puede presentar elementos omitidos o desorganización.','El estudiante sigue en su mayoría la estructura de la introducción, incluyendo los elementos necesarios, aunque puede presentar alguna falta de coherencia.','El estudiante sigue claramente la estructura de la introducción, incluyendo los elementos necesarios y relacionándolos de manera coherente.'] },
  { name: 'Planteamiento del problema', levels: ['La descripción del problema no es clara, ya que no enuncia sus causas, consecuencias ni cómo abordarlo. No cita datos o cifras que respalden la problemática y no formula el problema mediante una pregunta.','Describe el problema claramente, mostrando sus causas, consecuencias y cómo abordarlo, pero no cita datos o cifras que respalden la problemática, aunque formula el problema mediante una pregunta.','Describe el problema claramente, mostrando sus causas, consecuencias y cómo abordarlo. Cita datos o cifras que respaldan la problemática y formula el problema mediante una pregunta.'] },
  { name: 'Justificación', levels: ['No es clara la forma de justificar el por qué y para qué se quiere estudiar e investigar el problema. No tiene en cuenta criterios como relevancia, importancia, viabilidad e impacto social.','Justifica de manera clara y coherente el por qué y para qué se quiere estudiar e investigar el problema, teniendo en cuenta algunos criterios como relevancia, importancia, viabilidad e impacto social.','Justifica de manera clara y coherente el por qué y para qué se quiere estudiar e investigar el problema, teniendo en cuenta los criterios de relevancia, importancia, viabilidad e impacto social.'] },
  { name: 'Objetivos general y específicos', levels: ['El objetivo general no es medible, guarda poca relación con el título y la pregunta problema, y debe ser mejorado. No es claro el qué se debe hacer, para qué y cómo hacerlo. Algunos objetivos específicos no están bien formulados, no son medibles y no permiten alcanzar el objetivo general.','El objetivo general es medible, guarda relación con el título y la pregunta problema, y es claro el qué se debe hacer, para qué y cómo hacerlo. Algunos objetivos específicos están bien formulados, son medibles y permiten alcanzar el objetivo general.','El objetivo general es medible, guarda relación con el título y la pregunta problema, y es claro el qué se debe hacer, para qué y cómo hacerlo. Todos los objetivos específicos están bien formulados, son medibles y permiten alcanzar el objetivo general.'] },
  { name: 'Marco teórico', levels: ['No demuestra una comprensión profunda de los conceptos y teorías relevantes que debe tener el proyecto para poder implementarlos en su desarrollo.','Integra adecuadamente las ideas y teorías en la construcción del marco teórico con base en lo sustentado.','Explica claramente la relevancia y pertinencia del marco teórico para el proyecto de investigación que desarrolla.'] },
  { name: 'Metodología', levels: ['No es clara la descripción del diseño metodológico del proyecto, ya que no se identifican elementos como el tipo de investigación, la población y la muestra, las técnicas de recolección de datos y las fases de ejecución del proyecto.','Hay una clara y buena descripción del tipo de investigación, la población y la muestra. Se presentan las técnicas de recolección de datos y se indican las fases de ejecución del proyecto. Sin embargo, se debe mejorar un poco la congruencia entre el diseño metodológico, el planteamiento del problema y los conceptos a desarrollar.','Hay una clara y excelente descripción del tipo de investigación, la población y la muestra. Se presentan las técnicas de recolección de datos y se indican las fases de ejecución del proyecto. Hay congruencia entre el diseño metodológico, el planteamiento del problema y los conceptos a utilizar.'] },
  { name: 'Resultados iniciales', levels: ['El avance de las actividades planteadas no es coherente para alcanzar los objetivos específicos.','El avance de las actividades planteadas es coherente para alcanzar los objetivos específicos. Sin embargo, se debe fortalecer la calidad del instrumento utilizado.','El avance de las actividades planteadas es coherente para alcanzar los objetivos específicos.'] },
  { name: 'Sustentación o presentación del proyecto', levels: ['Se realiza una presentación con el recurso digital utilizado, aunque el recurso no contiene los lineamientos establecidos. Se evidencia poco dominio temático y no se responden de forma adecuada las preguntas formuladas por los jurados.','Se realiza una buena presentación con el recurso digital utilizado, el cual contiene los lineamientos establecidos. Se evidencia un buen dominio temático, aunque no se responden de forma adecuada en su totalidad las preguntas formuladas por los jurados.','Se realiza una excelente presentación con el recurso digital utilizado, el cual contiene los lineamientos establecidos. Se evidencia un excelente dominio temático y se responden de forma adecuada las preguntas formuladas por los jurados.'] },
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
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[20%] text-center">Criterio</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[22%]">1.0 – 2.9<br/><span className="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">Deficiente</span></th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[22%]">3.0 – 3.9<br/><span className="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">Bueno</span></th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-[22%]">4.0 – 5.0<br/><span className="text-[9px] font-medium opacity-60 italic normal-case tracking-normal">Excelente</span></th>
                <th className="px-8 py-6 text-[10px] font-black text-primary uppercase tracking-[0.2em] w-[14%] text-right">Calificación</th>
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
