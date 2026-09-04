export default function Input({ label, hint, error, icon: Icon, className = '', ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
          {label}
        </span>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        )}
        <input
          className={`w-full h-11 rounded-xl border bg-white text-[15px] text-ink-900 placeholder:text-slate-400 transition-colors focus:border-ink-500 focus:ring-2 focus:ring-ink-100 outline-none ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } ${error ? 'border-rose-300' : 'border-slate-200'} ${className}`}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-slate-400 mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
    </label>
  )
}
