export default function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-8 h-8 border-[3px] border-primary-200 border-t-primary rounded-full animate-spin mb-3"></div>
      <p className="section-label">{text}</p>
    </div>
  )
}
