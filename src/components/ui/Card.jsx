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
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="text-[15px] font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
