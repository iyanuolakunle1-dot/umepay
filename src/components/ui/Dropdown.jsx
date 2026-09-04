import { useEffect, useRef, useState } from 'react'

export default function Dropdown({ trigger, children, align = 'right', className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={`absolute z-40 mt-2 min-w-[220px] rounded-xl border border-slate-100 bg-white shadow-popover animate-scale-in origin-top-${
            align === 'right' ? 'right' : 'left'
          } ${align === 'right' ? 'right-0' : 'left-0'} ${className}`}
        >
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({ icon: Icon, children, className = '', ...props }) {
  return (
    <button
      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-slate-50 transition-colors text-left first:rounded-t-xl last:rounded-b-xl ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} className="text-slate-400" />}
      {children}
    </button>
  )
}
