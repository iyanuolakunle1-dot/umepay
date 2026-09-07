import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Copy,
  Eye,
  EyeOff,
  Pencil,
  ChevronRight,
  Sliders,
  Receipt,
  Trash2,
  Lock,
  Unlock,
  PlusCircle,
  X,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import VirtualCardVisual from '../components/cards/VirtualCardVisual.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function CardDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { cards, toggleCardFreeze, deleteCard, updateCardLabel, fundCard } = useApp()

  const card = cards.find((c) => c.id === id) || cards[0]
  const [showFullNumber, setShowFullNumber] = useState(false)
  const [editLabelOpen, setEditLabelOpen] = useState(false)
  const [newLabel, setNewLabel] = useState(card?.label || '')
  const [fundModalOpen, setFundModalOpen] = useState(false)
  const [fundAmount, setFundAmount] = useState('100.00')

  if (!card) {
    return (
      <DashboardLayout title="Card Details">
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 max-w-md mx-auto my-12">
          <p className="text-slate-500 mb-4">Card not found or was removed.</p>
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

  const isFrozen = card.status === 'FROZEN'
  const percentUsed = Math.min(
    100,
    Math.round(((card.spentThisMonth || 0) / (card.spendLimit || 500)) * 100)
  )

  function handleCopyNumber() {
    navigator.clipboard?.writeText(card.fullCardNumber || '4532 8921 4410 4821')
    toast.success('Card Number Copied', 'Full 16-digit card number copied to clipboard.')
  }

  function handleToggleFreeze() {
    toggleCardFreeze(card.id)
    if (isFrozen) {
      toast.success('Card Unfrozen', `${card.label} is now active for transactions.`)
    } else {
      toast.info('Card Frozen', `${card.label} has been temporarily locked.`)
    }
  }

  function handleDeleteCard() {
    if (window.confirm(`Are you sure you want to delete ${card.label}? This cannot be undone.`)) {
      deleteCard(card.id)
      toast.success('Card Deleted', 'The virtual card has been terminated.')
      navigate('/cards')
    }
  }

  function handleSaveLabel(e) {
    e.preventDefault()
    if (newLabel.trim()) {
      updateCardLabel(card.id, newLabel.trim())
      toast.success('Card Renamed', `Card label updated to ${newLabel.trim()}.`)
      setEditLabelOpen(false)
    }
  }

  function handleFundSubmit(e) {
    e.preventDefault()
    fundCard(card.id, fundAmount)
    toast.success('Card Funded', `Successfully added ${card.symbol}${fundAmount} to ${card.label}.`)
    setFundModalOpen(false)
  }

  return (
    <DashboardLayout title="Card Details">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb Navigation matching screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Link to="/cards" className="hover:text-slate-600 transition-colors">
                Cards
              </Link>
              <span>&gt;</span>
              <span className="text-slate-600 font-medium">
                {card.currency} Card — {card.label}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Card Details
            </h2>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2">
            <Link
              to={`/cards/${card.id}`}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-950 font-bold text-xs"
            >
              Overview
            </Link>
            <Link
              to={`/cards/${card.id}/transactions`}
              className="px-3.5 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 font-semibold text-xs transition-colors"
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

        {/* Main Grid matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Card Graphic & Card Information */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col items-center">
              <div className="w-full flex justify-center mb-6">
                <VirtualCardVisual
                  label={card.label}
                  last4={card.last4}
                  fullNumber={card.fullCardNumber}
                  showNumber={showFullNumber}
                  holder={card.holder}
                  expiry={card.expiry}
                  currency={card.currency}
                  colorScheme={card.colorScheme}
                  cardType={card.cardType}
                  isFrozen={isFrozen}
                />
              </div>

              {/* Show / Copy Number Buttons */}
              <div className="w-full grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowFullNumber(!showFullNumber)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {showFullNumber ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showFullNumber ? 'Hide Number' : 'Show Card Number'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>Copy Card Number</span>
                </button>
              </div>
            </div>

            {/* Card Information Table matching screenshot */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Card Information</h3>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400">Card Label</span>
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span>{card.label}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewLabel(card.label)
                        setEditLabelOpen(true)
                      }}
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400">Card Type</span>
                  <span className="font-bold text-slate-900">{card.cardType}</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400">Currency</span>
                  <span className="font-bold text-slate-900">{card.currency} ({card.symbol})</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400">Created Date</span>
                  <span className="font-bold text-slate-900">{card.createdDate}</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400">Status</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      isFrozen
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Stats & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quick Stats Box matching screenshot */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-6">
              <h3 className="font-bold text-slate-900 text-sm">Quick Stats</h3>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  CURRENT BALANCE
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {card.symbol}
                  {card.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Monthly Spend Limit Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Monthly Spend Limit</span>
                  <span className="text-slate-900">
                    {card.symbol}{card.spentThisMonth?.toLocaleString() || '0.00'} / {card.symbol}{card.spendLimit?.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#0F172A] rounded-full transition-all duration-500"
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">
                  {percentUsed}% of your monthly budget used
                </p>
              </div>

              {/* Link to transactions */}
              <div className="border-t border-slate-100 pt-4">
                <Link
                  to={`/cards/${card.id}/transactions`}
                  className="flex items-center justify-between text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  <span className="text-slate-500 font-normal">Transactions This Month</span>
                  <span className="flex items-center gap-1 font-bold text-slate-900">
                    {card.txCountThisMonth || 12} transactions &gt;
                  </span>
                </Link>
              </div>
            </div>

            {/* Action Buttons matching screenshot */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setFundModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs flex items-center gap-2"
              >
                <PlusCircle size={14} />
                <span>Fund Card</span>
              </button>

              <button
                type="button"
                onClick={handleToggleFreeze}
                className={`px-6 py-3 rounded-xl border font-semibold text-xs tracking-wide transition-colors cursor-pointer flex items-center gap-2 ${
                  isFrozen
                    ? 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                    : 'border-orange-300 text-orange-600 hover:bg-orange-50'
                }`}
              >
                {isFrozen ? <Unlock size={14} /> : <Lock size={14} />}
                <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteCard}
                className="px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer ml-auto flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Delete Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Card Label Modal */}
      {editLabelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setEditLabelOpen(false)}
              className="absolute right-4 top-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
            >
              <X size={14} />
            </button>
            <h4 className="text-base font-bold text-slate-900 mb-4">Edit Card Label</h4>
            <form onSubmit={handleSaveLabel} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Label
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditLabelOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-semibold cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fund Card Modal */}
      {fundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setFundModalOpen(false)}
              className="absolute right-4 top-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
            >
              <X size={14} />
            </button>
            <h4 className="text-base font-bold text-slate-900 mb-1">Fund Virtual Card</h4>
            <p className="text-xs text-slate-400 mb-4">Top up balance for {card.label}</p>
            <form onSubmit={handleFundSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Amount to Fund ({card.currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    {card.symbol}
                  </span>
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="w-full h-11 pl-8 pr-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFundModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Confirm &amp; Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
