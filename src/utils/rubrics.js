/**
 * Rúbricas de evaluación por fase del proyecto
 * Cada rúbrica contiene 10 criterios con puntaje máximo de 5 cada uno.
 * Total por rúbrica: 50 puntos.
 *
 * levels[0] = Deficiente (0.0 – 2.9)
 * levels[1] = Bueno     (3.0 – 3.9)
 * levels[2] = Excelente (4.0 – 5.0)
 */

export const RUBRICA_PROPUESTA = [
  {
    name: 'Título del Proyecto',
    levels: [
      'El título es ambiguo, supera las 20 palabras o no refleja la naturaleza del problema/solución; no hay coherencia con el objetivo general ni con la pregunta problema.',
      'El título es conciso (≤ 20 palabras), describe con claridad el objeto de estudio, pero presenta alineación parcial con el objetivo general o con la pregunta problema.',
      'El título es preciso, conciso (≤ 20 palabras), refleja el problema y la solución propuesta, y está perfectamente alineado con el objetivo general y la pregunta problema.',
    ],
  },
  {
    name: 'Introducción',
    levels: [
      'La introducción omite elementos esenciales (contexto, motivación, alcance, estructura del documento) o los presenta de forma desarticulada, dificultando la comprensión del proyecto.',
      'La introducción incluye la mayoría de los elementos requeridos (contexto, antecedentes, alcance), pero la coherencia entre secciones es mejorable o algún componente está poco desarrollado.',
      'La introducción contextualiza el problema, justifica la pertinencia del proyecto, delimita el alcance y anticipa la estructura del documento de forma clara, fluida y coherente.',
    ],
  },
  {
    name: 'Planteamiento del Problema',
    levels: [
      'El problema no está claramente enunciado; faltan causas, consecuencias y cifras que lo sustenten; no se formula una pregunta problema concreta.',
      'El problema se describe con sus causas y consecuencias, se formula la pregunta problema, pero el soporte con datos o cifras verificables es insuficiente.',
      'El problema se describe con precisión, incluye causas, consecuencias, evidencia empírica (datos/cifras) y una pregunta problema clara, acotada y verificable.',
    ],
  },
  {
    name: 'Justificación',
    levels: [
      "La justificación no evidencia relevancia, importancia, viabilidad ni impacto del proyecto; el argumento es vago o no responde al '¿por qué?' y '¿para qué?'.",
      'La justificación aborda algunos criterios (relevancia, importancia o impacto social), pero no los articula todos de forma integrada; la viabilidad no se argumenta con suficiencia.',
      'La justificación articula de forma coherente la relevancia académica/social, la importancia del problema, la viabilidad técnica y económica, y el impacto esperado del proyecto.',
    ],
  },
  {
    name: 'Objetivos General y Específicos',
    levels: [
      'El objetivo general no es verificable ni guarda relación con el título o la pregunta problema; los objetivos específicos no están formulados con verbos de acción medibles ni permiten alcanzar el general.',
      'El objetivo general es medible y coherente con el título; algunos objetivos específicos están bien formulados con verbos de acción SMART, aunque no todos contribuyen con claridad al objetivo general.',
      'El objetivo general es verificable, alineado con el título y la pregunta problema, e indica qué, para qué y cómo; todos los objetivos específicos son medibles, usan verbos SMART y conforman una ruta coherente hacia el general.',
    ],
  },
  {
    name: 'Marco Teórico y Estado del Arte',
    levels: [
      'No se evidencia comprensión de los conceptos, tecnologías o teorías que sustentan el proyecto; el estado del arte está ausente o desactualizado; las fuentes no son pertinentes o confiables.',
      'El marco teórico cubre los conceptos centrales con fuentes pertinentes y relativamente actuales; el estado del arte existe pero no diferencia claramente trabajos relacionados del proyecto propio.',
      'El marco teórico integra conceptos, modelos y tecnologías clave con fuentes actualizadas y confiables; el estado del arte identifica trabajos relacionados, evidencia las brechas y justifica la propuesta.',
    ],
  },
  {
    name: 'Metodología y Plan de Trabajo',
    levels: [
      'El diseño metodológico no identifica el tipo de investigación, la población/muestra, las técnicas de recolección de datos ni las fases del proyecto; no hay coherencia con el planteamiento.',
      'Se describen el tipo de investigación, población/muestra y las técnicas de recolección; las fases están definidas pero el cronograma o la coherencia metodológica con el problema presentan inconsistencias.',
      'La metodología especifica el tipo de investigación, población/muestra, técnicas e instrumentos de recolección de datos y fases con cronograma; existe coherencia plena entre el diseño, el problema y los conceptos a utilizar.',
    ],
  },
  {
    name: 'Resultados Esperados y Factibilidad',
    levels: [
      'Los resultados esperados son vagos o inconsistentes con los objetivos específicos; no se analiza la factibilidad técnica, económica ni operativa del proyecto.',
      'Los resultados esperados se derivan de los objetivos específicos; se presenta un análisis parcial de factibilidad, aunque faltan aspectos técnicos, económicos u operativos.',
      'Los resultados esperados son concretos, medibles y coherentes con cada objetivo específico; se incluye un análisis de factibilidad técnica, económica y operativa que respalda la viabilidad de la propuesta.',
    ],
  },
  {
    name: 'Sustentación y Dominio Temático',
    levels: [
      'La presentación no sigue los lineamientos establecidos; el dominio temático es insuficiente y las preguntas del jurado no son respondidas con argumentos sólidos.',
      'La presentación sigue los lineamientos y evidencia buen dominio temático; algunas preguntas del jurado son respondidas con argumentos incompletos o poco precisos.',
      'La presentación es clara, estructurada y cumple todos los lineamientos; se demuestra excelente dominio temático y las preguntas del jurado se responden con argumentos precisos y fundamentados.',
    ],
  },
  {
    name: 'Feedback del Público',
    levels: [
      'Evalúa si las preguntas son pertinentes con el problema y la propuesta presentada.',
      'Evalúa si las preguntas son pertinentes con el problema y la propuesta presentada.',
      'Evalúa si las preguntas son pertinentes con el problema y la propuesta presentada.',
    ],
  },
]

export const RUBRICA_DESARROLLO = [
  {
    name: 'Título del Proyecto',
    levels: [
      'El título sigue siendo ambiguo o no refleja la evolución del proyecto; supera las 20 palabras o ha perdido coherencia con la pregunta problema y los avances realizados.',
      'El título es conciso y descriptivo; guarda relación con el objetivo general, aunque no incorpora con precisión el alcance técnico actual del desarrollo.',
      'El título es preciso (≤ 20 palabras), refleja el estado actual del desarrollo, mantiene coherencia con el objetivo general, la pregunta problema y los avances técnicos evidenciados.',
    ],
  },
  {
    name: 'Introducción',
    levels: [
      'La introducción no refleja los avances del proyecto; hay incoherencias entre lo planteado inicialmente y el estado actual del desarrollo; faltan elementos esenciales.',
      'La introducción actualiza el contexto y los avances parciales, pero no articula con suficiencia los cambios o decisiones técnicas tomadas durante el desarrollo.',
      'La introducción refleja fielmente el estado del proyecto, contextualiza los avances, menciona los ajustes realizados frente a la propuesta inicial y mantiene coherencia con los objetivos.',
    ],
  },
  {
    name: 'Planteamiento del Problema',
    levels: [
      'El planteamiento no ha sido ajustado a la luz de los hallazgos del desarrollo; persisten imprecisiones en causas, consecuencias o la pregunta problema.',
      'El planteamiento ha sido refinado con base en el avance del proyecto; la pregunta problema es coherente con el desarrollo, aunque puede profundizarse en la justificación empírica.',
      'El planteamiento refleja el aprendizaje del proceso de desarrollo; causas, consecuencias, datos de respaldo y la pregunta problema son precisos, actualizados y coherentes con la solución en construcción.',
    ],
  },
  {
    name: 'Justificación Técnica y Social',
    levels: [
      'La justificación no vincula el avance técnico con el impacto social o la relevancia del proyecto; los argumentos no han evolucionado desde la propuesta.',
      'La justificación incorpora elementos del avance técnico y menciona el impacto potencial, pero no todos los criterios (relevancia, importancia, viabilidad, impacto) están articulados con el estado actual del desarrollo.',
      'La justificación integra los resultados parciales del desarrollo para reforzar la relevancia, viabilidad técnica demostrada e impacto social esperado; los argumentos son sólidos y coherentes con el avance real del proyecto.',
    ],
  },
  {
    name: 'Cumplimiento de Objetivos y Trazabilidad',
    levels: [
      'Los objetivos específicos no se han reformulado o ajustado según los aprendizajes del desarrollo; no existe trazabilidad entre los objetivos y los entregables producidos.',
      'Los objetivos muestran avance parcial; existe trazabilidad entre algunos objetivos específicos y los entregables; el objetivo general mantiene coherencia, aunque puede verse afectado por cambios no documentados.',
      'Los objetivos se han cumplido o ajustado de forma documentada y justificada; existe trazabilidad clara entre cada objetivo específico, las actividades realizadas y los entregables producidos; el objetivo general se evidencia en pleno proceso de cumplimiento.',
    ],
  },
  {
    name: 'Marco Teórico Aplicado y Tecnologías Utilizadas',
    levels: [
      'No se evidencia cómo los conceptos del marco teórico se aplican en el desarrollo; las tecnologías/herramientas seleccionadas no están justificadas o son inadecuadas para el problema.',
      'El marco teórico se vincula parcialmente con el desarrollo; las tecnologías utilizadas están mencionadas pero su justificación técnica frente a alternativas es incompleta.',
      'El marco teórico se aplica de forma explícita en las decisiones de diseño y desarrollo; las tecnologías, frameworks, patrones o arquitecturas seleccionadas están justificadas técnicamente y son coherentes con los requisitos del proyecto.',
    ],
  },
  {
    name: 'Avance Metodológico',
    levels: [
      'Las fases o actividades metodológicas no se ejecutan conforme al plan; no hay registro del avance, de los riesgos gestionados ni de las decisiones tomadas durante el desarrollo.',
      'El avance sigue parcialmente el plan metodológico; se ejecutan algunas actividades completadas y ajustes al cronograma, pero la gestión de riesgos o la documentación de decisiones es deficiente.',
      'El proyecto avanza conforme al plan metodológico o documenta justificadamente los ajustes realizados; se evidencia gestión de riesgos, registro de decisiones técnicas y cumplimiento de hitos acordados.',
    ],
  },
  {
    name: 'Resultados Parciales',
    levels: [
      'Los resultados parciales no son coherentes con los objetivos específicos; los artefactos de software (prototipos, módulos, BD, pruebas) están ausentes, son incompletos o presentan errores significativos.',
      'Los resultados parciales evidencian avance en la construcción de los artefactos principales; existen prototipos o módulos funcionales, aunque con limitaciones técnicas que requieren mejora antes de la entrega final.',
      'Los resultados parciales son coherentes con los objetivos específicos; los artefactos de software (arquitectura, módulos funcionales, base de datos, pruebas unitarias) demuestran calidad técnica y avance sustancial hacia el producto final.',
    ],
  },
  {
    name: 'Sustentación Técnica y Demostración',
    levels: [
      'La sustentación no demuestra el avance técnico real; el dominio de las tecnologías utilizadas es insuficiente y las preguntas del jurado sobre decisiones de diseño o implementación no se responden con propiedad.',
      'La sustentación presenta los avances de forma organizada y el dominio técnico es aceptable; la mayoría de las preguntas del jurado se responden correctamente, aunque algunas respuestas carecen de profundidad.',
      'La sustentación demuestra el producto en funcionamiento, evidencia dominio técnico de las herramientas y decisiones de arquitectura, y responde con precisión y argumentación sólida las preguntas técnicas del jurado.',
    ],
  },
  {
    name: 'Feedback del Público',
    levels: [
      'Evalúa si las preguntas indagan sobre los avances técnicos y decisiones de diseño evidenciadas.',
      'Evalúa si las preguntas indagan sobre los avances técnicos y decisiones de diseño evidenciadas.',
      'Evalúa si las preguntas indagan sobre los avances técnicos y decisiones de diseño evidenciadas.',
    ],
  },
]

export const RUBRICA_APLICACION = [
  {
    name: 'Título del Proyecto',
    levels: [
      'El título no representa el producto final entregado; es ambiguo, supera las 20 palabras o no guarda coherencia con los objetivos alcanzados y la solución implementada.',
      'El título identifica correctamente el producto final y es coherente con el objetivo general; podría ser más específico respecto al valor diferencial o el alcance de la solución entregada.',
      'El título es preciso, conciso (≤ 20 palabras) y representa fielmente el producto final; refleja la naturaleza de la solución implementada y mantiene coherencia con los objetivos alcanzados.',
    ],
  },
  {
    name: 'Introducción',
    levels: [
      'La introducción no integra el ciclo completo del proyecto; no hay evidencia del proceso recorrido desde la propuesta hasta la entrega final; faltan conclusiones preliminares.',
      'La introducción integra el proceso del proyecto y los resultados principales; describe el producto final, aunque la síntesis del recorrido metodológico o las lecciones aprendidas están poco desarrolladas.',
      'La introducción presenta el cierre del proyecto de forma coherente, integra el proceso completo (propuesta→desarrollo→entrega), describe el producto final y anticipa las conclusiones y lecciones aprendidas.',
    ],
  },
  {
    name: 'Problema Resuelto',
    levels: [
      'No se evidencia que el producto final resuelva el problema planteado; falta validación con usuarios, datos o pruebas que demuestren que la solución aborda las causas identificadas.',
      'El producto aborda el problema planteado; existe alguna evidencia de validación (pruebas funcionales, feedback de usuarios), aunque no cubre todas las causas o escenarios identificados en el planteamiento.',
      'El producto final resuelve el problema de forma demostrable; se presentan resultados de validación con usuarios reales o datos empíricos que confirman que la solución atiende las causas, consecuencias y la pregunta problema original.',
    ],
  },
  {
    name: 'Impacto Social, Técnico y Pertinencia',
    levels: [
      'No se evidencia el impacto real del proyecto; la justificación inicial no se contrasta con los resultados obtenidos; el aporte técnico o social del producto no está argumentado.',
      'Se describe el impacto potencial del producto; se establece alguna relación entre la justificación inicial y los resultados, pero el análisis de pertinencia social y técnica es superficial.',
      'Se presenta un análisis del impacto social y técnico real del producto, contrastando la justificación inicial con los resultados obtenidos; el proyecto demuestra relevancia, pertinencia y viabilidad sostenida de la solución implementada.',
    ],
  },
  {
    name: 'Logro de Objetivos y Producto Final',
    levels: [
      'El producto final no satisface el objetivo general ni los objetivos específicos; existen brechas significativas entre lo propuesto y lo entregado, sin justificación documentada de los cambios.',
      'El producto final satisface la mayoría de los objetivos específicos y el objetivo general de forma parcial; las brechas existentes están parcialmente documentadas o justificadas.',
      'El producto final satisface plenamente el objetivo general y todos los objetivos específicos; cualquier ajuste respecto al plan original está documentado y justificado; la trazabilidad propuesta→desarrollo→entrega es clara y completa.',
    ],
  },
  {
    name: 'Calidad Técnica del Producto de Software',
    levels: [
      'El producto presenta errores funcionales de forma significativa; carece de documentación técnica, no sigue estándares de calidad (código limpio, patrones de diseño, seguridad) y no ha sido sometido a pruebas formales.',
      'El producto es funcional con errores menores; existe documentación técnica básica; se aplican algunos estándares de calidad; las pruebas realizadas son parciales (funcionales o unitarias, pero no integrales).',
      'El producto es funcional, estable y documentado; aplica buenas prácticas de ingeniería (arquitectura limpia, patrones de diseño, manejo de errores, seguridad básica); se han realizado pruebas funcionales, de integración y/o de usabilidad que respaldan la calidad del sistema.',
    ],
  },
  {
    name: 'Metodología Ejecutada y Lecciones Aprendidas',
    levels: [
      'La metodología planificada no fue ejecutada de forma coherente; no se documentan lecciones aprendidas ni se reflexiona sobre las decisiones tomadas, los errores cometidos o los logros alcanzados.',
      'La metodología fue ejecutada en su mayoría; se presentan algunas lecciones aprendidas y reflexiones sobre el proceso, aunque el análisis crítico de las decisiones tomadas es limitado.',
      'La metodología fue ejecutada de forma completa y documentada; se presenta un análisis reflexivo de las lecciones aprendidas, incluyendo decisiones técnicas, obstáculos superados, buenas prácticas adoptadas y recomendaciones para futuros proyectos.',
    ],
  },
  {
    name: 'Resultados Finales, Pruebas y Entregables',
    levels: [
      'Los resultados finales no son coherentes con los objetivos; los entregables están incompletos (falta código fuente, documentación, manual de usuario o de instalación); las pruebas son insuficientes o inexistentes.',
      'Los resultados finales evidencian el producto construido; la mayoría de los entregables están presentes, aunque la documentación o las pruebas presentan vacíos que afectan la completitud de la entrega.',
      'Los resultados finales son coherentes con todos los objetivos; el paquete de entregables está completo (código fuente, documentación técnica, manual de usuario, evidencia de pruebas); los resultados demuestran un producto de software de calidad, funcional y sostenible.',
    ],
  },
  {
    name: 'Sustentación Final y Defensa del Producto',
    levels: [
      'La sustentación no demuestra el producto funcionando; el dominio técnico y conceptual es insuficiente; las preguntas del jurado sobre el producto, las decisiones de diseño o el impacto no se responden con argumentos sólidos.',
      'La sustentación presenta el producto de forma organizada y realiza una demostración funcional; el dominio técnico es aceptable; la mayoría de las preguntas se responden correctamente, aunque algunas argumentaciones carecen de profundidad.',
      'La sustentación incluye una demostración funcional del producto final, evidencia dominio técnico y conceptual profundo, y responde con argumentación sólida y reflexiva las preguntas del jurado sobre el producto, la arquitectura, las decisiones tomadas y el impacto generado.',
    ],
  },
  {
    name: 'Feedback del Público',
    levels: [
      'Evalúa si las preguntas miden la percepción del público sobre la utilidad, impacto y calidad del producto final.',
      'Evalúa si las preguntas miden la percepción del público sobre la utilidad, impacto y calidad del producto final.',
      'Evalúa si las preguntas miden la percepción del público sobre la utilidad, impacto y calidad del producto final.',
    ],
  },
]

/**
 * Selecciona la rúbrica correcta según la categoría/fase del proyecto.
 * Respeta los valores internos existentes: 'Propuesta', 'Desarrollo', 'Aplicación' / 'Aplicado'
 */
export function getRubricByCategoria(categoria) {
  if (!categoria) return RUBRICA_PROPUESTA
  const c = categoria.toLowerCase()
  if (c === 'desarrollo') return RUBRICA_DESARROLLO
  if (c === 'aplicación' || c === 'aplicacion' || c === 'aplicado') return RUBRICA_APLICACION
  return RUBRICA_PROPUESTA
}
