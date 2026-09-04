import { Link } from 'react-router-dom'
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, ShoppingBag } from 'lucide-react'

const actions = [
  { to: '/send', label: 'Send', icon: ArrowUpRight },
  { to: '/receive', label: 'Receive', icon: ArrowDownLeft },
  { to: '/convert', label: 'Convert', icon: ArrowLeftRight },
  { to: '/wallets', label: 'Spend', icon: ShoppingBag },
]

export default function QuickActions({ className = '' }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
      {actions.map((a) => (
        <Link
          key={a.label}
          to={a.to}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors py-4 shadow-card"
        >
          <div className="h-9 w-9 rounded-lg bg-ink-50 text-ink-700 grid place-items-center">
            <a.icon size={17} />
          </div>
          <span className="text-xs font-semibold text-ink-800">{a.label}</span>
        </Link>
      ))}
    </div>
  )
}
