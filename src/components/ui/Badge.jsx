const tones = {
  emerald: 'bg-emerald-50 text-emerald-700',
  rose: 'bg-rose-50 text-rose-600',
  amber: 'bg-amber-50 text-amber-700',
  blue: 'bg-blue-50 text-blue-700',
  violet: 'bg-violet-50 text-violet-700',
  orange: 'bg-orange-50 text-orange-600',
  indigo: 'bg-indigo-50 text-indigo-700',
  slate: 'bg-slate-100 text-slate-600',
  ink: 'bg-ink-50 text-ink-700',
}

export default function Badge({ tone = 'slate', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    Success: 'emerald',
    Pending: 'amber',
    Failed: 'rose',
  }
  return <Badge tone={map[status] || 'slate'}>{status}</Badge>
}
