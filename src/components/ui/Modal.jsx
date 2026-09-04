import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, children, className = '', size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${sizes[size]} bg-white rounded-t-3xl sm:rounded-2xl shadow-popover animate-scale-in max-h-[92vh] overflow-y-auto ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export function ModalHeader({ title, badge, onClose }) {
  return (
    <div className="flex items-center justify-between px-6 pt-6">
      <div className="flex items-center gap-2">
        {badge}
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="h-8 w-8 grid place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}
