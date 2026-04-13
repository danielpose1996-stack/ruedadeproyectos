export const CATEGORY_STYLES = {
  'Desarrollo': 'bg-blue-50 text-blue-600 border border-blue-100',
  'Propuesta': 'bg-amber-50 text-amber-600 border border-amber-100',
  'Aplicación': 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  'Aplicado': 'bg-emerald-50 text-emerald-600 border border-emerald-100',
}

export const ROLE_BADGE_STYLES = {
  admin: 'bg-slate-800 text-white border-slate-700',
  docente: 'bg-primary-50 text-primary border-primary-200',
  estudiante: 'bg-emerald-50 text-emerald-600 border-emerald-100',
}

export const POSTULACION_ESTADO_CONFIG = {
  'Pendiente de revisión': { badge: 'bg-amber-50 text-amber-600 border border-amber-100', icon: 'fa-clock' },
  'En revisión': { badge: 'bg-blue-50 text-blue-600 border border-blue-100', icon: 'fa-magnifying-glass' },
  'Aprobado': { badge: 'bg-emerald-50 text-emerald-600 border border-emerald-100', icon: 'fa-circle-check' },
  'No aprobado': { badge: 'bg-red-50 text-status-danger border border-red-100', icon: 'fa-circle-xmark' },
}
