import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'

export default function AccountDetailModal({ account, onClose }) {
  const toast = useToast()
  const navigate = useNavigate()

  if (!account) return null

  const isCrypto = ['BTC', 'ETH', 'USDT', 'USDC'].includes(account.code)

  function copyAddress() {
    const addressToCopy = account.fullAddress || account.walletAddress || account.accountNumber || ''
    if (navigator.clipboard && addressToCopy) {
      navigator.clipboard.writeText(addressToCopy)
      toast.success('Copied to Clipboard', `${account.name} address copied.`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        {/* Header matching screenshot */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] tracking-wider uppercase ${
                account.code === 'BTC'
                  ? 'bg-amber-100/90 text-amber-800'
                  : account.code === 'ETH'
                  ? 'bg-indigo-100/90 text-indigo-800'
                  : account.code === 'USDT' || account.code === 'USDC'
                  ? 'bg-emerald-100/90 text-emerald-800'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {account.code}
            </span>
            <h3 className="font-bold text-slate-900 text-base">
              {account.name?.includes('(') ? account.name : `${account.name} (${account.code})`} Account
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Gradient Banner matching screenshot */}
        <div className="rounded-2xl p-6 mb-5 text-white bg-gradient-to-r from-[#0E0348] via-[#1A066E] to-[#26008E] shadow-lg relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
            TOTAL WALLET BALANCE
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1 font-mono">
            {account.code === 'BTC' ? '₿' : account.symbol || ''}
            {account.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {account.code}
          </p>
          <p className="text-xs font-bold text-emerald-400">
            ≈ ${(account.usdEquivalent || 405.0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </p>
        </div>

        {/* Details Card matching screenshot */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 divide-y divide-slate-100 text-xs mb-5 space-y-2">
          <div className="flex items-center justify-between pb-2">
            <span className="text-slate-400 font-medium">Wallet Network</span>
            <span className="font-bold text-slate-900">
              {account.network || 'Bitcoin Mainnet'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400 font-medium">
              {isCrypto ? 'Wallet Address' : 'Account Number'}
            </span>
            <button
              type="button"
              onClick={copyAddress}
              className="flex items-center gap-1.5 font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer font-mono"
            >
              <span>{account.walletAddress || account.accountMask || 'bc1qxy2k...f2483'}</span>
              <Copy size={13} className="text-slate-500" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-400 font-medium">Average Buy Price</span>
            <span className="font-bold text-slate-900">
              ${(account.avgBuyPrice || 89500).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
        </div>

        {/* Last 3 Transactions matching screenshot */}
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-900 mb-2.5">
            Last 3 {account.code} Transactions
          </p>

          <div className="space-y-2">
            {(account.recentTransactions || [
              { id: 't1', description: 'Received BTC', amount: 0.002, direction: 'in' },
              { id: 't2', description: 'Sent to External Wallet', amount: -0.001, direction: 'out' },
              { id: 't3', description: 'Convert from USD', amount: 0.0015, direction: 'in' },
            ]).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50/70 text-xs"
              >
                <span className="font-bold text-slate-800">{t.description}</span>
                <span
                  className={`font-bold ${
                    t.direction === 'in' || t.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {t.amount > 0 ? `+${t.amount}` : t.amount} {account.code}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions matching screenshot */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              onClose()
              navigate(`/send?asset=${account.code}`)
            }}
            className="py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs transition-colors cursor-pointer text-center shadow-xs"
          >
            Send
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              navigate(`/receive?asset=${account.code}`)
            }}
            className="py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Receive
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              navigate(`/convert?from=${account.code}`)
            }}
            className="py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  )
}
