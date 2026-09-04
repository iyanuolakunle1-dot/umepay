import { useEffect, useMemo, useState } from 'react'
import { Calendar, Download } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { StatusBadge } from '../components/ui/Badge.jsx'
import { SkeletonRow } from '../components/ui/Skeleton.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const FILTERS = ['All', 'Sent', 'Received', 'Converted', 'Failed']
const PAGE_SIZE = 9

function formatAmount(item) {
  const prefix = item.currencyPrefix || '$'
  const sign = item.direction === 'in' ? '+' : item.direction === 'out' ? '-' : ''
  const value =
    typeof item.amount === 'number'
      ? item.amount.toLocaleString(undefined, {
          minimumFractionDigits: item.currencyPrefix ? 0 : item.suffix ? 4 : 2,
          maximumFractionDigits: item.currencyPrefix ? 0 : item.suffix ? 4 : 2,
        })
      : item.amount
  return `${sign}${prefix === '$' && item.suffix ? '' : prefix}${value}${item.suffix ? ' ' + item.suffix : ''}`
}

export default function TransactionHistory() {
  const { activity } = useApp()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'All') return activity
    if (filter === 'Failed') return activity.filter((a) => a.status === 'Failed')
    return activity.filter((a) => a.type === filter.replace('Sent', 'Send').replace('Received', 'Receive'))
  }, [activity, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilter(f) {
    setFilter(f)
    setPage(1)
  }

  function exportCsv() {
    toast.success('Exporting CSV', `${filtered.length} transactions queued for download.`)
  }

  return (
    <DashboardLayout title="Transaction History">
      <Card padded={false} className="overflow-hidden">
        <div className="p-5 sm:p-6 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-ink-900">Activity &amp; Ledger</h3>
          <Button variant="outline" size="sm" icon={Download} onClick={exportCsv}>
            Export (CSV)
          </Button>
        </div>

        <div className="px-5 sm:px-6 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === f
                    ? 'bg-ink-800 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Calendar size={14} /> Jan 1, 2026 – Jan 25, 2026
          </span>
        </div>

        {/* Desktop table */}
        <div className="mt-5 hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-y border-slate-100">
                {['Date & Time', 'Description', 'Type', 'Asset', 'Amount', 'Fee', 'Status', 'Reference ID'].map(
                  (h) => (
                    <th key={h} className="px-6 py-3 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-6 py-3">
                        <SkeletonRow />
                      </td>
                    </tr>
                  ))
                : pageItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <p className="font-semibold text-ink-900">{item.date}</p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-ink-900 whitespace-nowrap">
                        {item.description}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-ink-700">{item.asset}</td>
                      <td
                        className={`px-6 py-3.5 font-semibold whitespace-nowrap ${
                          item.direction === 'in' ? 'text-emerald-600' : 'text-ink-900'
                        }`}
                      >
                        {formatAmount(item)}
                      </td>
                      <td className="px-6 py-3.5 text-slate-400 whitespace-nowrap">
                        {typeof item.fee === 'number' ? `$${item.fee.toFixed(2)}` : item.fee}
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-3.5 text-slate-400 whitespace-nowrap">{item.reference}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden px-5 sm:px-6 mt-4 divide-y divide-slate-50">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} className="py-3" />)
            : pageItems.map((item) => (
                <div key={item.id} className="py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink-900 text-sm">{item.description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.asset} • {item.date}, {item.time}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-semibold shrink-0 ${
                        item.direction === 'in' ? 'text-emerald-600' : 'text-ink-900'
                      }`}
                    >
                      {formatAmount(item)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">{item.reference}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
        </div>

        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={Calendar}
            title="No transactions found"
            description="Try a different filter or date range."
          />
        )}

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 sm:px-6 py-5">
            <p className="text-xs text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
              {filtered.length} transactions
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${
                    page === i + 1 ? 'bg-ink-800 text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}
