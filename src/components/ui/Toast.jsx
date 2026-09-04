import { createPortal } from 'react-dom'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'

const iconMap = {
  success: <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />,
  error: <XCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />,
  info: <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />,
  default: <Info size={18} className="text-ink-600 shrink-0 mt-0.5" />,
}

const borderMap = {
  success: 'border-emerald-100',
  error: 'border-rose-100',
  info: 'border-blue-100',
  default: 'border-slate-100',
}

export default function ToastViewport({ toasts, onDismiss }) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <div className="fixed z-[100] top-4 right-4 left-4 sm:left-auto flex flex-col gap-2 items-stretch sm:items-end pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto w-full sm:w-80 bg-white rounded-xl shadow-popover border ${
            borderMap[t.variant]
          } p-3.5 flex items-start gap-2.5 animate-slide-in-right`}
        >
          {iconMap[t.variant]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink-900 leading-snug">{t.title}</p>
            {t.description && (
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
            className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
