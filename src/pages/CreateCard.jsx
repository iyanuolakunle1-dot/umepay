import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Check, CheckCircle2, Zap, X } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import VirtualCardVisual from '../components/cards/VirtualCardVisual.jsx'
import { CurrencyBadge } from '../components/common/RealIcons.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const currencyOptions = [
  {
    code: 'USD',
    name: 'USD Card',
    subtitle: 'United States Dollar',
    desc: 'Best for international payments & SAAS',
    colorScheme: 'blue',
    walletLabel: 'USD Wallet ($12,450.32 Available)',
  },
  {
    code: 'NGN',
    name: 'NGN Card',
    subtitle: 'Nigerian Naira',
    desc: 'Local transactions & utility bills',
    colorScheme: 'navy',
    walletLabel: 'NGN Wallet (₦4,250,000 Available)',
  },
  {
    code: 'EUR',
    name: 'EUR Card',
    subtitle: 'Euro',
    desc: 'European merchants & European travel',
    colorScheme: 'gold',
    walletLabel: 'EUR Wallet (€2,400.00 Available)',
  },
  {
    code: 'GBP',
    name: 'GBP Card',
    subtitle: 'British Pound',
    desc: 'UK-based services & sterling rails',
    colorScheme: 'purple',
    walletLabel: 'GBP Wallet (£1,500.00 Available)',
  },
]

export default function CreateCard() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, createCard } = useApp()

  const [step, setStep] = useState(1) // 1: Select Currency, 2: Configure Card
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [cardLabel, setCardLabel] = useState('Netflix & Subscriptions')
  const [spendingLimitEnabled, setSpendingLimitEnabled] = useState(true)
  const [spendingLimitAmount, setSpendingLimitAmount] = useState('500.00')
  const [autoFundEnabled, setAutoFundEnabled] = useState(true)
  const [fundingSource, setFundingSource] = useState('USD Wallet')

  // Modals
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [createdModalOpen, setCreatedModalOpen] = useState(false)
  const [createdCardData, setCreatedCardData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeOption = currencyOptions.find((c) => c.code === selectedCurrency) || currencyOptions[0]

  function handleCurrencySelect(code) {
    setSelectedCurrency(code)
    const opt = currencyOptions.find((c) => c.code === code)
    if (opt) {
      setFundingSource(opt.code === 'USD' ? 'USD Wallet' : opt.code === 'NGN' ? 'NGN Wallet' : opt.code === 'EUR' ? 'EUR Wallet' : 'GBP Wallet')
    }
  }

  function handleCreateCardSubmit() {
    setIsSubmitting(true)
    setTimeout(() => {
      const newCard = createCard({
        label: cardLabel || `${selectedCurrency} Virtual Card`,
        currency: selectedCurrency,
        spendLimit: spendingLimitEnabled ? spendingLimitAmount : 10000,
        autoFund: autoFundEnabled,
        fundingSource,
      })

      setIsSubmitting(false)
      setReviewModalOpen(false)
      setCreatedCardData(newCard)
      setCreatedModalOpen(true)
      toast.success('Card Created', 'Your new virtual card is ready to use instantly.')
    }, 600)
  }

  return (
    <DashboardLayout title="Create Virtual Card">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Step Indicator Header matching screenshot */}
        <div className="flex items-center justify-start gap-4 sm:gap-8 pb-2">
          {/* Step 1 */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step > 1
                  ? 'bg-emerald-500 text-white'
                  : step === 1
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > 1 ? <Check size={13} strokeWidth={3} /> : '1'}
            </div>
            <span
              className={`text-xs font-bold ${
                step === 1 ? 'text-slate-900' : step > 1 ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              Select Currency
            </span>
          </div>

          <div
            className={`w-12 h-[2px] transition-colors ${
              step > 1 ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          />

          {/* Step 2 */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-bold ${
                step === 2 ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              Configure Card
            </span>
          </div>

          <div className="w-12 h-[2px] bg-slate-200" />

          {/* Step 3 */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-xs font-bold text-slate-400">
              Confirm &amp; Create
            </span>
          </div>
        </div>

        {/* STEP 1: Select Card Currency */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Select Card Currency
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currencyOptions.map((opt) => {
                const isSelected = selectedCurrency === opt.code

                return (
                  <div
                    key={opt.code}
                    onClick={() => handleCurrencySelect(opt.code)}
                    className={`relative bg-white rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between h-48 hover:shadow-sm ${
                      isSelected
                        ? 'border-indigo-900 ring-2 ring-indigo-900/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <CurrencyBadge code={opt.code} size="md" />

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-indigo-900 bg-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-950" />}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{opt.name}</h3>
                      <p className="text-xs text-slate-400 font-medium mb-3">{opt.subtitle}</p>
                      <div className="border-t border-slate-100 pt-2.5">
                        <p className="text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer"
              >
                Continue →
              </button>

              <button
                type="button"
                onClick={() => navigate('/cards')}
                className="px-6 py-3 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Configure Your Card */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Configure Your Card
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Controls */}
              <div className="lg:col-span-7 space-y-6">
                {/* Card Label */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    CARD LABEL / NICKNAME
                  </label>
                  <input
                    type="text"
                    value={cardLabel}
                    onChange={(e) => setCardLabel(e.target.value)}
                    placeholder="e.g. Netflix & Subscriptions"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                {/* Spending Limit Toggle & Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        SPENDING LIMIT
                      </p>
                      <p className="text-xs text-slate-400">
                        Set a maximum monthly spend threshold
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSpendingLimitEnabled(!spendingLimitEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        spendingLimitEnabled ? 'bg-[#0F172A]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          spendingLimitEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {spendingLimitEnabled && (
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-sm font-semibold text-slate-500">
                          {selectedCurrency === 'NGN' ? '₦' : selectedCurrency === 'EUR' ? '€' : selectedCurrency === 'GBP' ? '£' : '$'}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={spendingLimitAmount}
                        onChange={(e) => setSpendingLimitAmount(e.target.value)}
                        placeholder="500.00"
                        className="w-full h-11 pl-8 pr-16 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        <span className="text-xs font-semibold text-slate-400">
                          {selectedCurrency}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Auto-Fund Toggle */}
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        AUTO-FUND CARD
                      </p>
                      <p className="text-xs text-slate-400">
                        Automatically top up card from primary {selectedCurrency} wallet when low
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAutoFundEnabled(!autoFundEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        autoFundEnabled ? 'bg-[#0F172A]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          autoFundEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Funding Source */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    FUNDING SOURCE
                  </label>
                  <select
                    value={fundingSource}
                    onChange={(e) => setFundingSource(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  >
                    <option value="USD Wallet">USD Wallet ($12,450.32 Available)</option>
                    <option value="NGN Wallet">NGN Wallet (₦4,250,000 Available)</option>
                    <option value="EUR Wallet">EUR Wallet (€2,400.00 Available)</option>
                    <option value="GBP Wallet">GBP Wallet (£1,500.00 Available)</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer"
                  >
                    Review Card →
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>

              {/* Live Preview Panel matching screenshot */}
              <div className="lg:col-span-5 bg-slate-50/80 rounded-3xl p-6 border border-slate-100 flex flex-col items-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-5 text-center">
                  LIVE CARD PREVIEW
                </p>

                <div className="w-full flex justify-center mb-6">
                  <VirtualCardVisual
                    label={cardLabel || `${selectedCurrency} Virtual Card`}
                    last4="4821"
                    holder={user.name.toUpperCase()}
                    expiry="09/28"
                    currency={selectedCurrency}
                    colorScheme={activeOption.colorScheme}
                  />
                </div>

                <div className="w-full space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <span>Card Network</span>
                    <strong className="text-slate-800 font-semibold">Visa debit international</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Initial Balance</span>
                    <strong className="text-slate-800 font-semibold">$0.00 (Fund on creation)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Exchange Rate Peg</span>
                    <strong className="text-slate-800 font-semibold">None (Direct {selectedCurrency})</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STEP 3 / MODAL: Review Card Details matching screenshot */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Review Card Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  CARD TYPE
                </p>
                <p className="text-sm font-bold text-slate-900">Virtual Visa Debit</p>
              </div>

              <div className="border-b border-slate-100 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  CURRENCY
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {selectedCurrency} ({activeOption.subtitle})
                </p>
              </div>

              <div className="border-b border-slate-100 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  CARD LABEL
                </p>
                <p className="text-sm font-bold text-slate-900">{cardLabel}</p>
              </div>

              <div className="border-b border-slate-100 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  MONTHLY SPENDING LIMIT
                </p>
                <p className="text-sm font-bold text-slate-900">
                  ${spendingLimitAmount} {selectedCurrency}
                </p>
              </div>

              <div className="border-b border-slate-100 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  AUTO-FUND SOURCE
                </p>
                <p className="text-sm font-bold text-slate-900">{fundingSource}</p>
              </div>

              {/* Creation Fee Box */}
              <div className="bg-slate-50 rounded-xl p-3.5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Creation Fee</span>
                <span className="px-2.5 py-1 rounded-md border border-emerald-500 bg-white text-[11px] font-bold text-emerald-600">
                  $0.00 (TIER 2 FREE)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                <Zap size={14} className="text-emerald-500 fill-emerald-500" />
                <span>Immediate issuance: <strong className="text-emerald-600">Instant Ready-to-use</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-6 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCreateCardSubmit}
                className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Card'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 / MODAL: Card Created Successfully matching screenshot */}
      {createdModalOpen && createdCardData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center mb-4">
              <Check size={28} strokeWidth={3} />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              Card Created Successfully
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Your new virtual card is ready to use instantly.
            </p>

            {/* Virtual Card Preview */}
            <div className="w-full flex justify-center mb-6">
              <VirtualCardVisual
                label={createdCardData.label}
                last4={createdCardData.last4}
                holder={createdCardData.holder}
                expiry={createdCardData.expiry}
                currency={createdCardData.currency}
                colorScheme={createdCardData.colorScheme}
              />
            </div>

            {/* Card Summary Table */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 text-xs space-y-2.5 text-left mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Card Label</span>
                <span className="font-bold text-slate-800">{createdCardData.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Card Number</span>
                <span className="font-bold text-slate-800 font-mono">•••• •••• •••• {createdCardData.last4}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Currency</span>
                <span className="font-bold text-slate-800">{createdCardData.currencyLabel}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-400">Status</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px]">
                  ACTIVE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setCreatedModalOpen(false)
                  navigate(`/cards/${createdCardData.id}`)
                }}
                className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                View Card Details
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreatedModalOpen(false)
                  navigate('/cards')
                }}
                className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs"
              >
                Back to Cards
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
