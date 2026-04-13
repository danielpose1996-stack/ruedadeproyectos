export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', loading = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-modal w-full max-w-md shadow-modal p-8 text-center animate-zoom-in" onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">{message}</p>
        <div className="flex gap-3">
          <button className="btn-ghost flex-1 !py-3 border border-slate-200" onClick={onClose} disabled={loading}>
            {cancelText}
          </button>
          <button className="btn-primary flex-1 !py-3" onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
