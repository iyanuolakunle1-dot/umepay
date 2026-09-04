import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, ChevronRight, CreditCard } from 'lucide-react'

const iconMap = {
  Send: ArrowUpRight,
  Receive: ArrowDownLeft,
  Convert: ArrowLeftRight,
}

const iconTone = {
  Send: 'bg-rose-50 text-rose-500',
  Receive: 'bg-emerald-50 text-emerald-600',
  Convert: 'bg-blue-50 text-blue-600',
}

export default function ActivityRow({ item, onClick }) {
  const Icon = iconMap[item.type] || CreditCard
  const amountLabel =
    item.type === 'Convert'
      ? `${item.currencyPrefix || ''}${item.amount.toLocaleString()}${item.suffix ? ' ' + item.suffix : ''}`
      : `${item.direction === 'in' ? '+' : item.direction === 'out' ? '-' : ''}${
          item.currencyPrefix || '$'
        }${item.amount.toLocaleString(undefined, { minimumFractionDigits: item.currencyPrefix ? 0 : 2 })}`

  const amountColor =
    item.status === 'Failed'
      ? 'text-slate-400 line-through'
      : item.direction === 'in'
      ? 'text-emerald-600'
      : item.direction === 'out'
      ? 'text-ink-900'
      : 'text-ink-900'

  return (
    <div
      onClick={() => onClick?.(item)}
      className="flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      <div
        className={`h-9 w-9 rounded-full grid place-items-center shrink-0 group-hover:scale-105 transition-transform ${
          iconTone[item.type] || 'bg-slate-100 text-slate-500'
        }`}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 truncate group-hover:text-[#18224b]">
          {item.description}
        </p>
        <p className="text-xs text-slate-400 truncate">
          {item.asset} • {item.date}, {item.time}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-semibold ${amountColor}`}>{amountLabel}</p>
        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
          View receipt →
        </span>
      </div>
    </div>
  )
}
