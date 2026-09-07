import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function CardTransactions() {
  const { id } = useParams()
  const { cards, cardTransactions } = useApp()

  const card = cards.find((c) => c.id === id) || cards[0]
  const [filterType, setFilterType] = useState('All') // All, Purchase, Refund, Decline
  const [page, setPage] = useState(1)

  if (!card) {
    return (
      <DashboardLayout title="Card Transactions">
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 max-w-md mx-auto my-12">
          <p className="text-slate-500 mb-4">Card not found.</p>
          <Link
            to="/cards"
            className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white font-semibold text-xs inline-block"
          >
            Back to Cards
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const filteredList = cardTransactions.filter((tx) => {
    if (filterType === 'All') return true
    return tx.type.toLowerCase() === filterType.toLowerCase()
  })

  return (
    <DashboardLayout title="Card Transactions">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Link to="/cards" className="hover:text-slate-600 transition-colors">
                Cards
              </Link>
              <span>&gt;</span>
              <Link to={`/cards/${card.id}`} className="hover:text-slate-600 transition-colors">
                {card.currency} Card — {card.label}
              </Link>
              <span>&gt;</span>
              <span className="text-slate-600 font-medium">Transactions</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Card Transactions
            </h2>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2">
            <Link
              to={`/cards/${card.id}`}
              className="px-3.5 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Overview
            </Link>
            <Link
              to={`/cards/${card.id}/transactions`}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-950 font-bold text-xs"
            >
              Transactions
            </Link>
            <Link
              to={`/cards/${card.id}/settings`}
              className="px-3.5 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar matching screenshot */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Purchase', 'Refund', 'Decline'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  filterType === t
                    ? 'bg-[#0F172A] text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white cursor-pointer hover:border-slate-300">
            <Calendar size={14} className="text-slate-400" />
            <span>Jan 1, 2026 - Jan 25, 2026</span>
          </div>
        </div>

        {/* Transactions Table matching screenshot */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">DATE &amp; TIME</th>
                  <th className="py-3.5 px-6">MERCHANT/DESCRIPTION</th>
                  <th className="py-3.5 px-6">CATEGORY</th>
                  <th className="py-3.5 px-6">AMOUNT</th>
                  <th className="py-3.5 px-6">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredList.map((tx) => {
                  const isDeclined = tx.status === 'DECLINED'
                  const isRefunded = tx.status === 'REFUNDED'
                  const isSuccessful = tx.status === 'SUCCESSFUL'

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{tx.date}</div>
                        <div className="text-[11px] text-slate-400">{tx.time}</div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{tx.merchant}</span>
                          {tx.statusNote && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
                              {tx.statusNote}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                        {tx.category}
                      </td>

                      <td className="py-4 px-6 font-bold whitespace-nowrap">
                        <span
                          className={
                            tx.amount > 0
                              ? 'text-emerald-600'
                              : isDeclined
                              ? 'text-rose-600'
                              : 'text-slate-900'
                          }
                        >
                          {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-md font-bold text-[10px] tracking-wide ${
                            isSuccessful
                              ? 'bg-emerald-50 text-emerald-600'
                              : isDeclined
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-sky-50 text-sky-600'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination footer matching screenshot */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 px-6 border-t border-slate-100 text-xs text-slate-400">
            <span>Showing 1-{filteredList.length} of 34 transactions</span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Prev
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-lg bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center"
              >
                1
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-lg hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center cursor-pointer"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => setPage(page + 1)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
