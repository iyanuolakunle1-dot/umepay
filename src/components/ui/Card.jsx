export default function Card({ className = '', padded = true, children, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-card ${
        padded ? 'p-5 sm:p-6' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, action, subtitle, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4 ${className}`}>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="max-w-full">{action}</div>}
    </div>
  )
}
