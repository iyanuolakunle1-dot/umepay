import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Plus,
  ArrowLeftRight,
  Clock,
  Check,
  Zap,
  Copy,
  ChevronDown,
  X,
  Share2,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import WalletRow from '../components/wallets/WalletRow.jsx'
import DigitalAssetRow from '../components/wallets/DigitalAssetRow.jsx'
import AccountDetailModal from '../components/wallets/AccountDetailModal.jsx'
import { CurrencyBadge } from '../components/common/RealIcons.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Wallets() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'conversions' ? 'conversions' : 'portfolio'
  const [activeTab, setActiveTab] = useState(initialTab)

  const {
    fiatAccounts,
    digitalAssets,
    totalPortfolioValue,
    conversions,
    convertAssets,
  } = useApp()
  const toast = useToast()

  const [selectedAccount, setSelectedAccount] = useState(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linking, setLinking] = useState(false)

  // Conversion State
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('NGN')
  const [fromAmount, setFromAmount] = useState('500.00')
  const [slippage, setSlippage] = useState('0.5%')

  // Modals
  const [reviewOpen, setReviewOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [completedConv, setCompletedConv] = useState(null)
  const [converting, setConverting] = useState(false)

  // Calculate rate
  const rateMultiplier =
    fromCurrency === 'USD' && toCurrency === 'NGN'
      ? 1580
      : fromCurrency === 'NGN' && toCurrency === 'USD'
      ? 1 / 1580
      : fromCurrency === 'USD' && toCurrency === 'BTC'
      ? 0.0000114
      : fromCurrency === 'USD' && toCurrency === 'EUR'
      ? 0.92
      : fromCurrency === 'EUR' && toCurrency === 'USD'
      ? 1.09
      : 1

  const calculatedToAmount = (parseFloat(fromAmount || 0) * rateMultiplier).toLocaleString(
    undefined,
    { maximumFractionDigits: toCurrency === 'BTC' ? 6 : 2 }
  )

  function handleSwap() {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  function handleConfirmConversion() {
    setConverting(true)
    setTimeout(() => {
      const result = convertAssets({
        fromAmount: parseFloat(fromAmount),
        fromCurrency,
        toAmount: parseFloat(fromAmount || 0) * rateMultiplier,
        toCurrency,
        exchangeRate: `1 ${fromCurrency} = ${rateMultiplier.toLocaleString()} ${toCurrency}`,
      })

      setConverting(false)
      setReviewOpen(false)
      setCompletedConv(result)
      setSuccessOpen(true)
      toast.success('Conversion Successful', 'Funds credited to your wallet instantly.')
    }, 600)
  }

  function copyRefId() {
    if (completedConv?.reference) {
      navigator.clipboard?.writeText(completedConv.reference)
      toast.success('Copied Reference ID')
    }
  }

  return (
    <DashboardLayout title="Wallets & Accounts">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Tab Switcher matching screenshot: Portfolio | Conversions */}
        <div className="flex items-center gap-8 border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('portfolio')
              setSearchParams({})
            }}
            className={`pb-3 text-sm font-bold transition-all cursor-pointer relative ${
              activeTab === 'portfolio'
                ? 'text-slate-900 border-b-2 border-indigo-900'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Portfolio
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('conversions')
              setSearchParams({ tab: 'conversions' })
            }}
            className={`pb-3 text-sm font-bold transition-all cursor-pointer relative ${
              activeTab === 'conversions'
                ? 'text-slate-900 border-b-2 border-indigo-900'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Conversions
          </button>
        </div>

        {/* TAB 1: PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Multi-Asset Portfolio Value
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs">
                    +4.2% (24h)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('conversions')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Convert Assets
                </button>
                <button
                  type="button"
                  onClick={() => setLinkOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Plus size={15} />
                  <span>Link New Account</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Fiat Accounts */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Fiat Accounts</h3>
                <div className="divide-y divide-slate-100">
                  {fiatAccounts.map((a) => (
                    <WalletRow key={a.id} account={a} onClick={setSelectedAccount} />
                  ))}
                </div>
              </div>

              {/* Digital Assets */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Digital Assets</h3>
                <div className="divide-y divide-slate-100">
                  {digitalAssets.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => setSelectedAccount(a)}
                      className="cursor-pointer"
                    >
                      <DigitalAssetRow asset={a} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONVERSIONS (Matching exact screenshots) */}
        {activeTab === 'conversions' && (
          <div className="space-y-6 animate-fade-in">
            {/* Instant Conversion Protocol Box matching screenshot */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Instant Conversion Protocol
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={13} />
                  <span>Exchange rate last updated: 1 min ago</span>
                </div>
              </div>

              {/* FROM / TO Grid */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* FROM (DEBIT ASSET) Card */}
                <div className="md:col-span-5 bg-slate-50/70 rounded-2xl border border-slate-200/60 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      FROM (DEBIT ASSET)
                    </span>
                    <span className="text-slate-500 font-medium">
                      Available: $2,100.50 USD
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="500.00"
                      className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-slate-900 focus:outline-none"
                    />

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                      <CurrencyBadge code={fromCurrency} size="sm" />
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
                      >
                        <option value="USD">USD</option>
                        <option value="NGN">NGN</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Swap Button in Middle */}
                <div className="md:col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="w-10 h-10 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white flex items-center justify-center transition-transform hover:rotate-180 cursor-pointer shadow-sm"
                  >
                    <ArrowLeftRight size={16} />
                  </button>
                </div>

                {/* TO (CREDIT ASSET) Card */}
                <div className="md:col-span-5 bg-slate-50/70 rounded-2xl border border-slate-200/60 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      TO (CREDIT ASSET)
                    </span>
                    <span className="text-slate-500 font-medium">
                      Rate: ₦1,580.00 / USD
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {calculatedToAmount}
                    </p>

                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                      <CurrencyBadge code={toCurrency} size="sm" />
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
                      >
                        <option value="NGN">NGN</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="BTC">BTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Column Rate & Info Box matching screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Exchange Rate
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    1 {fromCurrency} = {rateMultiplier.toLocaleString()} {toCurrency}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Conversion Fee
                  </p>
                  <p className="text-xs font-bold text-emerald-600">
                    $0.00 USD (Zero Fee Conversion)
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 flex flex-col justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Slippage Tolerance
                  </p>
                  <div className="flex items-center gap-1.5">
                    {['0.5%', '1.0%', 'Custom'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlippage(s)}
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                          slippage === s
                            ? 'bg-[#0F172A] text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Convert Assets Button matching screenshot */}
              <button
                type="button"
                onClick={() => setReviewOpen(true)}
                className="w-full py-4 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm tracking-wide transition-colors cursor-pointer shadow-sm"
              >
                Convert Assets
              </button>
            </div>

            {/* Recent Currency Conversions matching screenshot */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Recent Currency Conversions
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                {conversions.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-slate-400 w-24">{c.date}</span>
                      <span className="font-bold text-slate-800">{c.text}</span>
                    </div>

                    <span className="font-bold text-slate-900 text-right">
                      {c.creditedText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Detail Modal */}
      <AccountDetailModal account={selectedAccount} onClose={() => setSelectedAccount(null)} />

      {/* REVIEW CONVERSION MODAL matching screenshot */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setReviewOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Review Conversion
            </h3>

            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  FROM DEBIT ACCOUNT
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {fromCurrency} Wallet ($1,000.00 Available)
                </p>
              </div>

              <div className="border-b border-slate-100 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  TO CREDIT ACCOUNT
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {toCurrency} Wallet
                </p>
              </div>

              {/* Calculation Box matching screenshot */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Conversion Amount</span>
                  <span className="font-bold text-slate-900">${fromAmount} {fromCurrency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Exchange Rate</span>
                  <span className="font-bold text-slate-900">1 {fromCurrency} = {rateMultiplier.toLocaleString()} {toCurrency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Network Fee</span>
                  <span className="font-bold text-emerald-600">$0.00 (UMEPAY Free)</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">Total to Debit</span>
                  <span className="font-extrabold text-slate-900">${fromAmount} {fromCurrency}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                <Zap size={14} className="text-emerald-500 fill-emerald-500" />
                <span>Arrival: <strong className="text-emerald-600">Instant Settlement</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={converting}
                onClick={handleConfirmConversion}
                className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {converting ? 'Converting...' : 'Confirm Conversion'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONVERSION SUCCESSFUL MODAL matching screenshot */}
      {successOpen && completedConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center mb-4">
              <Check size={28} strokeWidth={3} />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              Conversion Successful
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Your funds have been converted and credited instantly.
            </p>

            {/* Summary Box matching screenshot */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 text-xs space-y-3.5 text-left mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Amount Converted</span>
                <span className="font-bold text-slate-900">${parseFloat(completedConv.fromAmount || 500).toFixed(2)} {completedConv.fromCurrency || 'USD'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Converted To</span>
                <span className="font-bold text-slate-900">
                  {completedConv.toCurrency === 'NGN' ? '₦' : completedConv.toCurrency === 'EUR' ? '€' : completedConv.toCurrency === 'GBP' ? '£' : '$'}
                  {Number(completedConv.toAmount || 790000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {completedConv.toCurrency || 'NGN'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Exchange Rate</span>
                <span className="font-bold text-slate-900">1 {completedConv.fromCurrency || 'USD'} = {rateMultiplier.toLocaleString(undefined, { minimumFractionDigits: 2 })} {completedConv.toCurrency || 'NGN'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Reference ID</span>
                <button
                  type="button"
                  onClick={copyRefId}
                  className="flex items-center gap-1.5 font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span>{completedConv.reference || 'CV-992847-XR'}</span>
                  <Copy size={13} className="text-slate-500" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Settlement Date</span>
                <span className="font-semibold text-slate-900">Sep 3, 2026 • 2:15 PM</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-slate-400 font-medium">Status</span>
                <span className="px-3 py-1 rounded-md border border-emerald-400 bg-emerald-50 text-emerald-600 font-bold text-[11px] tracking-wide">
                  SUCCESSFUL
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  toast.success('Receipt Link Created', 'Receipt link copied to clipboard.')
                }}
                className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
              >
                Share Receipt
              </button>

              <button
                type="button"
                onClick={() => setSuccessOpen(false)}
                className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs"
              >
                Back to Wallets
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
