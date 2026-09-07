import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function CardSettings() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { cards, updateCardSettings } = useApp()

  const card = cards.find((c) => c.id === id) || cards[0]

  const defaultSettings = {
    spendingLimitEnabled: true,
    monthlyLimit: 500.0,
    perTxLimitEnabled: false,
    perTxLimit: 250.0,
    dailyTxCountEnabled: false,
    dailyTxCount: 5,
    onlineTx: true,
    internationalTx: true,
    contactless: false,
    atmWithdrawals: false,
    txAlerts: true,
    declineAlerts: true,
    summaryEmail: true,
    autoFundEnabled: true,
    minThreshold: 50.0,
    topUpAmount: 200.0,
    fundingSource: 'USD Wallet',
  }

  const [settings, setSettings] = useState(card?.settings || defaultSettings)

  useEffect(() => {
    if (card?.settings) {
      setSettings(card.settings)
    }
  }, [card?.id])

  if (!card) {
    return (
      <DashboardLayout title="Card Settings">
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

  function handleToggle(key) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleChange(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave(e) {
    e.preventDefault()
    updateCardSettings(card.id, settings)
    toast.success('Settings Saved', 'Virtual card security and spending controls updated.')
  }

  return (
    <DashboardLayout title="Card Settings">
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
              <span className="text-slate-600 font-medium">Settings</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Card Settings
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
              className="px-3.5 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Transactions
            </Link>
            <Link
              to={`/cards/${card.id}/settings`}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-950 font-bold text-xs"
            >
              Settings
            </Link>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Spending Controls matching screenshot */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-5">
                <h3 className="font-bold text-slate-900 text-sm">Spending Controls</h3>

                {/* Monthly Spending Limit */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Monthly Spending Limit</p>
                      <p className="text-[11px] text-slate-400">Limit the total amount that can be spent each month</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle('spendingLimitEnabled')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        settings.spendingLimitEnabled ? 'bg-[#0F172A]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.spendingLimitEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.spendingLimitEnabled && (
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-xs font-bold text-slate-400">{card.symbol}</span>
                      </div>
                      <input
                        type="number"
                        value={settings.monthlyLimit}
                        onChange={(e) => handleChange('monthlyLimit', parseFloat(e.target.value))}
                        className="w-full h-10 pl-8 pr-14 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-400">{card.currency}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Per-Transaction Limit */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Per-Transaction Limit</p>
                    <p className="text-[11px] text-slate-400">Max amount allowed for a single purchase</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('perTxLimitEnabled')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      settings.perTxLimitEnabled ? 'bg-[#0F172A]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.perTxLimitEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Daily Transaction Count Limit */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Daily Transaction Count Limit</p>
                    <p className="text-[11px] text-slate-400">Restrict the number of transactions per day</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('dailyTxCountEnabled')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      settings.dailyTxCountEnabled ? 'bg-[#0F172A]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.dailyTxCountEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Security Settings matching screenshot */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Security Settings</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Online Transactions</p>
                    <p className="text-[11px] text-slate-400">Enable web payments and digital checkouts</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('onlineTx')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      settings.onlineTx ? 'bg-[#0F172A]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.onlineTx ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-800">International Transactions</p>
                    <p className="text-[11px] text-slate-400">Allow cross-border billing and foreign currency merchant checkouts</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('internationalTx')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      settings.internationalTx ? 'bg-[#0F172A]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.internationalTx ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 opacity-60">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Contactless Payments</p>
                    <p className="text-[11px] text-slate-400">Virtual cards only</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent bg-slate-200">
                    <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 translate-x-0" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 opacity-60">
                  <div>
                    <p className="text-xs font-bold text-slate-800">ATM Withdrawals</p>
                    <p className="text-[11px] text-slate-400">Not available for virtual cards</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent bg-slate-200">
                    <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 translate-x-0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Alerts & Notifications matching screenshot */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Alerts &amp; Notifications</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Transaction Alerts</p>
                    <p className="text-[11px] text-slate-400">Instant push notifications for successful transactions</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('txAlerts')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      settings.txAlerts ? 'bg-[#0F172A]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.txAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Decline Alerts</p>
                    <p className="text-[11px] text-slate-400">Notifications when transaction fails or limit exceeded</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('declineAlerts')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      settings.declineAlerts ? 'bg-[#0F172A]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.declineAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Monthly Summary Email</p>
                    <p className="text-[11px] text-slate-400">Receive detailed monthly bill statement directly to your email</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('summaryEmail')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      settings.summaryEmail ? 'bg-[#0F172A]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.summaryEmail ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Auto-Fund Settings matching screenshot */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Auto-Fund Settings</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Auto-Fund</p>
                    <p className="text-[11px] text-slate-400">Automatically top up when balance drops below minimum threshold</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('autoFundEnabled')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      settings.autoFundEnabled ? 'bg-[#0F172A]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.autoFundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {settings.autoFundEnabled && (
                  <div className="space-y-4 pt-3 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          MINIMUM THRESHOLD
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            {card.symbol}
                          </span>
                          <input
                            type="number"
                            value={settings.minThreshold}
                            onChange={(e) => handleChange('minThreshold', parseFloat(e.target.value))}
                            className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          TOP-UP AMOUNT
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            {card.symbol}
                          </span>
                          <input
                            type="number"
                            value={settings.topUpAmount}
                            onChange={(e) => handleChange('topUpAmount', parseFloat(e.target.value))}
                            className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        FUNDING SOURCE
                      </label>
                      <select
                        value={settings.fundingSource}
                        onChange={(e) => handleChange('fundingSource', e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-indigo-600"
                      >
                        <option value="USD Wallet">USD Wallet</option>
                        <option value="NGN Wallet">NGN Wallet</option>
                        <option value="EUR Wallet">EUR Wallet</option>
                        <option value="GBP Wallet">GBP Wallet</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Changes Button matching screenshot */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
