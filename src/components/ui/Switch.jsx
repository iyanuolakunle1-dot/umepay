import { Check, X } from 'lucide-react'

export default function Switch({ checked, onChange, label, size = 'md', disabled = false }) {
  const isChecked = Boolean(checked)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange && onChange(!isChecked)}
      className={`group relative inline-flex items-center shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        isChecked
          ? 'bg-emerald-600 hover:bg-emerald-700'
          : 'bg-slate-300 hover:bg-slate-400'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        size === 'sm' ? 'h-5 w-9' : size === 'lg' ? 'h-8 w-14' : 'h-7 w-12'
      }`}
    >
      {/* Knob */}
      <span
        className={`pointer-events-none flex items-center justify-center rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out ${
          size === 'sm'
            ? 'h-4 w-4 text-[9px]'
            : size === 'lg'
            ? 'h-7 w-7 text-xs'
            : 'h-6 w-6 text-[10px]'
        } ${
          isChecked
            ? size === 'sm'
              ? 'translate-x-4 text-emerald-600'
              : size === 'lg'
              ? 'translate-x-6 text-emerald-600'
              : 'translate-x-5 text-emerald-600'
            : 'translate-x-0 text-slate-400'
        }`}
      >
        {isChecked ? (
          <Check size={size === 'sm' ? 10 : 12} strokeWidth={3} />
        ) : (
          <X size={size === 'sm' ? 10 : 12} strokeWidth={2.5} />
        )}
      </span>
    </button>
  )
}
