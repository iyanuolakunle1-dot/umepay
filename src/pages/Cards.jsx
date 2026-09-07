import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, CreditCard, ShieldCheck } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import VirtualCardVisual from '../components/cards/VirtualCardVisual.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Cards() {
  const { cards, toggleCardFreeze, user } = useApp()
  const toast = useToast()
  const navigate = useNavigate()

  const totalCards = cards.length
  const activeCards = cards.filter((c) => c.status === 'ACTIVE').length
  const frozenCards = cards.filter((c) => c.status === 'FROZEN').length

  function handleFreezeToggle(card) {
    toggleCardFreeze(card.id)
    if (card.status === 'ACTIVE') {
      toast.info(`Card Frozen`, `${card.label} has been temporarily locked.`)
    } else {
      toast.success(`Card Unfrozen`, `${card.label} is now active for transactions.`)
    }
  }

  return (
    <DashboardLayout title="Virtual Cards">
      {cards.length === 0 ? (
        // Empty state matching screenshot
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center px-4">
          <div className="w-full bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-indigo-50/80 text-indigo-900 flex items-center justify-center mb-6">
              <CreditCard size={36} strokeWidth={1.75} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Cards Yet</h2>
            <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
              Create your first virtual card to make online payments, subscriptions, and more securely.
            </p>

            <Link
              to="/cards/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
            >
              Create New Card →
            </Link>

            <div className="w-full border-t border-slate-100 my-8" />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/50 text-[12px] font-medium text-slate-600">
              <span className="font-bold text-emerald-600">TIER 2+</span>
              <span>Virtual cards are available for Tier 2+ accounts</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Unverified KYC Warning Banner */}
          {!user.kycVerified && (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-300 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Personal Tier 2 Required for Virtual Cards</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Virtual card issuance and spending require verified identity. Complete KYC in less than 2 minutes to issue unlimited multi-currency cards.
                  </p>
                </div>
              </div>

              <Link
                to="/kyc"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
              >
                <span>Verify Identity Now</span>
              </Link>
            </div>
          )}

          {/* Top Summary Bar matching screenshot */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:px-6 sm:py-3.5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span>Total Cards:</span>
                <span className="text-slate-900 font-bold">{totalCards}</span>
              </div>
              <span className="text-slate-200">|</span>
              <div className="flex items-center gap-1.5">
                <span>Active:</span>
                <span className="text-emerald-600 font-bold">{activeCards}</span>
              </div>
              <span className="text-slate-200">|</span>
              <div className="flex items-center gap-1.5">
                <span>Frozen:</span>
                <span className="text-amber-500 font-bold">{frozenCards}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 hidden md:inline">
                Verified Limit: <strong className="text-slate-700">${(user.monthlyCardRemaining || 15000).toLocaleString()}.00 / month remaining</strong>
              </span>

              <Link
                to="/cards/create"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>Create New Card</span>
              </Link>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card) => {
              const isFrozen = card.status === 'FROZEN'

              return (
                <div
                  key={card.id}
                  className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-slate-200 transition-all group"
                >
                  {/* Virtual Card Graphic */}
                  <div className="w-full mb-5 flex justify-center">
                    <VirtualCardVisual
                      label={card.label}
                      last4={card.last4}
                      holder={card.holder}
                      expiry={card.expiry}
                      currency={card.currency}
                      colorScheme={card.colorScheme}
                      cardType={card.cardType}
                      isFrozen={isFrozen}
                    />
                  </div>

                  {/* Card Details & Balance */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          AVAILABLE BALANCE
                        </p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">
                          {card.symbol}
                          {card.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isFrozen ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            isFrozen ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          {isFrozen ? 'Frozen' : 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/cards/${card.id}`)}
                        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors text-center cursor-pointer"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFreezeToggle(card)}
                        className={`w-full py-2.5 px-3 rounded-xl border font-semibold text-xs transition-colors text-center cursor-pointer ${
                          isFrozen
                            ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        {isFrozen ? 'Unfreeze' : 'Freeze'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
