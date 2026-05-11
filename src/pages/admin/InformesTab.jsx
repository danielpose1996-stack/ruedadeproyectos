import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const FASES = ['Propuesta', 'Desarrollo', 'Aplicación']
const FASE_COLORS = { 'Propuesta': '#6366f1', 'Desarrollo': '#22c55e', 'Aplicación': '#f59e0b' }
const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4']

export default function InformesTab() {
  const [informe, setInforme] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fechaGeneracion, setFechaGeneracion] = useState(null)

  async function generarInforme() {
    setLoading(true)
    setError('')
    try {
      const { data: proyectos, error: projError } = await supabase
        .from('proyectos')
        .select('id, nombre, categoria, linea_investigacion, estado')
      if (projError) throw projError

      const { data: evaluaciones, error: evalError } = await supabase
        .from('evaluaciones')
        .select('proyecto_id, puntaje_final, proyectos(categoria)')
      if (evalError) throw evalError

      const total = proyectos.length

      const porFase = FASES.map(fase => {
        const n = proyectos.filter(p => p.categoria === fase).length
        return { fase, total: n, porcentaje: total > 0 ? ((n / total) * 100).toFixed(1) : '0.0' }
      })

      const lineaMap = {}
      proyectos.forEach(p => {
        const linea = p.linea_investigacion?.trim() || 'Sin especificar'
        lineaMap[linea] = (lineaMap[linea] || 0) + 1
      })
      const porLinea = Object.entries(lineaMap)
        .sort((a, b) => b[1] - a[1])
        .map(([linea, count]) => ({
          linea,
          total: count,
          porcentaje: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'
        }))

      const promediosPorFase = FASES.map(fase => {
        const evs = evaluaciones.filter(e => e.proyectos?.categoria === fase && e.puntaje_final != null)
        if (evs.length === 0) return { fase, promedio: null, cantidad: 0 }
        const suma = evs.reduce((acc, e) => acc + Number(e.puntaje_final), 0)
        return { fase, promedio: (suma / evs.length).toFixed(2), cantidad: evs.length }
      })

      const totalEvaluados = evaluaciones.length > 0
        ? [...new Set(evaluaciones.map(e => e.proyecto_id))].length
        : 0

      setInforme({ total, porFase, porLinea, promediosPorFase, totalEvaluados })
      setFechaGeneracion(new Date())
    } catch (e) {
      console.error(e)
      setError(e.message || 'Error al generar el informe')
    } finally {
      setLoading(false)
    }
  }

  function descargarPDF() {
    if (!informe) return
    const doc = new jsPDF()
    const fecha = fechaGeneracion?.toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })

    doc.setFontSize(20)
    doc.setTextColor(79, 70, 229)
    doc.text('Informe de Proyectos', 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(79, 70, 229)
    doc.text('Rueda de Proyectos SISINFO', 14, 30)

    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text(`Fecha de generación: ${fecha}`, 14, 40)

    doc.setFontSize(12)
    doc.setTextColor(30, 30, 30)
    doc.text(`Total de proyectos presentados: ${informe.total}`, 14, 52)
    doc.text(`Total de proyectos evaluados: ${informe.totalEvaluados}`, 14, 60)

    doc.setFontSize(13)
    doc.setTextColor(79, 70, 229)
    doc.text('Proyectos por Fase', 14, 74)
    autoTable(doc, {
      startY: 78,
      head: [['Fase', 'Total Proyectos', 'Porcentaje']],
      body: informe.porFase.map(f => [f.fase, f.total, `${f.porcentaje}%`]),
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 }
    })

    const y1 = doc.lastAutoTable.finalY + 12
    doc.setFontSize(13)
    doc.setTextColor(79, 70, 229)
    doc.text('Proyectos por Línea de Investigación', 14, y1)
    autoTable(doc, {
      startY: y1 + 4,
      head: [['Línea de Investigación', 'Total', 'Porcentaje']],
      body: informe.porLinea.map(l => [l.linea, l.total, `${l.porcentaje}%`]),
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 }
    })

    const y2 = doc.lastAutoTable.finalY + 12
    doc.setFontSize(13)
    doc.setTextColor(79, 70, 229)
    doc.text('Promedio de Calificación por Fase', 14, y2)
    autoTable(doc, {
      startY: y2 + 4,
      head: [['Fase', 'Promedio (/50)', 'Proyectos Evaluados']],
      body: informe.promediosPorFase.map(p => [
        p.fase,
        p.promedio !== null ? `${p.promedio} / 50` : 'Sin datos',
        p.cantidad
      ]),
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 10 }
    })

    doc.save(`informe-rueda-proyectos-${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  const CustomTooltipFase = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-border-color rounded-xl shadow-lg p-3 text-sm">
          <p className="font-bold text-slate-800">{payload[0].payload.fase}</p>
          <p className="text-primary font-semibold">{payload[0].value} proyectos</p>
          <p className="text-slate-500">{payload[0].payload.porcentaje}%</p>
        </div>
      )
    }
    return null
  }

  const CustomTooltipProm = ({ active, payload }) => {
    if (active && payload?.length) {
      const val = payload[0].payload.promedio
      return (
        <div className="bg-white border border-border-color rounded-xl shadow-lg p-3 text-sm">
          <p className="font-bold text-slate-800">{payload[0].payload.fase}</p>
          <p className="text-primary font-semibold">{val !== null ? `${val} / 50` : 'Sin datos'}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
            Informes de Proyectos
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-4">Genera un informe consolidado de la rueda de proyectos</p>
        </div>
        <div className="flex gap-3">
          {informe && (
            <button
              onClick={descargarPDF}
              className="flex items-center gap-2 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-bold px-5 py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <i className="fa-solid fa-file-pdf text-sm"></i> Descargar PDF
            </button>
          )}
          <button
            onClick={generarInforme}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
          >
            {loading
              ? <><i className="fa-solid fa-spinner animate-spin"></i> Generando...</>
              : <><i className="fa-solid fa-chart-bar"></i> Generar Informe</>
            }
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl border border-red-100">
          <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
        </div>
      )}

      {/* Empty state */}
      {!informe && !loading && (
        <div className="bg-surface rounded-3xl border border-border-color border-dashed flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <i className="fa-solid fa-chart-pie text-2xl text-indigo-500"></i>
          </div>
          <p className="text-slate-500 font-medium text-sm">Presiona <strong>"Generar Informe"</strong> para consultar los datos actuales</p>
        </div>
      )}

      {/* Report content */}
      {informe && (
        <div className="space-y-8">

          {/* Fecha */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <i className="fa-regular fa-clock"></i>
            Informe generado el {fechaGeneracion?.toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}
          </div>

          {/* Tarjetas resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard icon="fa-diagram-project" color="indigo" label="Total proyectos presentados" value={informe.total} />
            <SummaryCard icon="fa-circle-check" color="green" label="Proyectos evaluados" value={informe.totalEvaluados} />
            <SummaryCard icon="fa-layer-group" color="amber" label="Fases registradas" value={informe.porFase.filter(f => f.total > 0).length} />
            <SummaryCard icon="fa-flask" color="violet" label="Líneas de investigación" value={informe.porLinea.length} />
          </div>

          {/* Proyectos por fase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tabla */}
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-color flex items-center gap-2">
                <i className="fa-solid fa-layer-group text-indigo-500"></i>
                <h3 className="font-bold text-slate-800">Proyectos por Fase</h3>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-border-color">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fase</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Total</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {informe.porFase.map(f => (
                    <tr key={f.fase} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: FASE_COLORS[f.fase] }}></span>
                          <span className="font-semibold text-slate-700 text-sm">{f.fase}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">{f.total}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{f.porcentaje}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Gráfico barras */}
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-chart-bar text-indigo-500"></i> Distribución por Fase
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={informe.porFase} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="fase" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltipFase />} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {informe.porFase.map(f => (
                      <Cell key={f.fase} fill={FASE_COLORS[f.fase]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Proyectos por línea de investigación */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tabla */}
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-color flex items-center gap-2">
                <i className="fa-solid fa-flask text-violet-500"></i>
                <h3 className="font-bold text-slate-800">Proyectos por Línea de Investigación</h3>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-border-color">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Línea</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Total</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {informe.porLinea.map((l, i) => (
                    <tr key={l.linea} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                          <span className="font-semibold text-slate-700 text-sm">{l.linea}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">{l.total}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg">{l.porcentaje}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Gráfico pie */}
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-chart-pie text-violet-500"></i> Distribución por Línea
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={informe.porLinea}
                    dataKey="total"
                    nameKey="linea"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ linea, porcentaje }) => `${porcentaje}%`}
                    labelLine={true}
                  >
                    {informe.porLinea.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [`${val} proyectos`, name]} />
                  <Legend formatter={(val) => <span className="text-xs font-semibold text-slate-600">{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Promedio por fase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tabla */}
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-color flex items-center gap-2">
                <i className="fa-solid fa-star-half-stroke text-amber-500"></i>
                <h3 className="font-bold text-slate-800">Promedio de Calificación por Fase</h3>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-border-color">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fase</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Promedio (/50)</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Evaluaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {informe.promediosPorFase.map(p => (
                    <tr key={p.fase} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: FASE_COLORS[p.fase] }}></span>
                          <span className="font-semibold text-slate-700 text-sm">{p.fase}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.promedio !== null
                          ? <span className="font-bold text-lg text-slate-800">{p.promedio}<span className="text-xs text-slate-400 font-normal"> /50</span></span>
                          : <span className="text-xs italic text-slate-400">Sin datos</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">{p.cantidad}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Gráfico barras promedios */}
            <div className="bg-surface rounded-3xl border border-border-color shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-chart-bar text-amber-500"></i> Promedio por Fase
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={informe.promediosPorFase.map(p => ({ ...p, promedio: p.promedio !== null ? parseFloat(p.promedio) : 0 }))}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="fase" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                  <YAxis domain={[0, 50]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltipProm />} />
                  <Bar dataKey="promedio" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {informe.promediosPorFase.map(p => (
                      <Cell key={p.fase} fill={FASE_COLORS[p.fase]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

function SummaryCard({ icon, color, label, value }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
  }
  const iconBg = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    violet: 'bg-violet-100 text-violet-600',
  }
  return (
    <div className={`bg-surface rounded-2xl border shadow-sm p-5 flex items-center gap-4 ${colors[color]}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg[color]}`}>
        <i className={`fa-solid ${icon} text-lg`}></i>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
        <p className="text-3xl font-black text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  )
}

function CustomTooltipFase({ active, payload }) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-slate-800">{payload[0].payload.fase}</p>
        <p className="text-indigo-600 font-semibold">{payload[0].value} proyectos</p>
        <p className="text-slate-400 text-xs">{payload[0].payload.porcentaje}% del total</p>
      </div>
    )
  }
  return null
}

function CustomTooltipProm({ active, payload }) {
  if (active && payload?.length) {
    const val = payload[0].payload.promedio
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-slate-800">{payload[0].payload.fase}</p>
        <p className="text-amber-600 font-semibold">{val > 0 ? `${val} / 50` : 'Sin datos'}</p>
      </div>
    )
  }
  return null
}
