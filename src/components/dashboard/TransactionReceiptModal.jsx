import React from 'react'
import { Copy, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'

export default function TransactionReceiptModal({ item, open, onClose }) {
  const toast = useToast()

  if (!open || !item) return null

  const referenceId = item.reference || item.id || 'TX-117349-BD'
  const isPositive = item.direction === 'in'
  const formattedAmount = `${item.currencyPrefix || '$'}${parseFloat(item.amount || 450).toFixed(2)} ${item.asset || 'USD'}`

  function handleCopyReference() {
    navigator.clipboard?.writeText(referenceId)
    toast.success('Reference ID Copied', referenceId)
  }

  function handleDownload() {
    toast.success('Receipt Downloaded', `Receipt for ${item.description || 'Transaction'} saved as PDF.`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Transaction Details
        </h3>

        {/* Hero Amount Box matching screenshot */}
        <div className="rounded-2xl bg-cyan-50/50 border border-cyan-100/60 p-6 text-center space-y-2 mb-6">
          <div>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-white border border-emerald-300 text-emerald-600 text-xs font-bold shadow-2xs">
              {item.status || 'Successful'}
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {formattedAmount}
          </p>
        </div>

        {/* Details Table matching screenshot */}
        <div className="text-xs space-y-3 pb-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Transaction Type</span>
            <span className="font-bold text-slate-900">{item.type === 'Receive' ? 'Receive Payment' : item.type === 'Convert' ? 'Conversion' : 'Send Payment'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">From Account</span>
            <span className="font-bold text-slate-900">Your UMEPAY ID (812 345 6789)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Recipient Details</span>
            <span className="font-bold text-slate-900">{item.recipient || item.description || 'Emma Wilson (*** **** 4567)'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Date &amp; Time</span>
            <span className="font-bold text-slate-900">{item.date ? `${item.date} ${item.time || '3:15 PM'}` : 'Jan 24, 2026 3:15 PM'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Reference ID</span>
            <button
              type="button"
              onClick={handleCopyReference}
              className="flex items-center gap-1.5 font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer font-mono"
            >
              <span>{referenceId}</span>
              <Copy size={13} className="text-slate-500" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Network Fee / Settlement</span>
            <span className="font-bold text-slate-900">{item.fee ? `$${item.fee.toFixed(2)} • ` : '$1.50 • '}Instant Settlement</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Category</span>
            <span className="font-bold text-slate-900">{item.category || 'Personal Transfer'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Note</span>
            <span className="font-bold text-slate-900">{item.remark || item.note || 'Monthly rent payment'}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-4">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs text-center"
          >
            Download Receipt
          </button>

          <button
            type="button"
            onClick={() => toast.info('Support Contacted', 'Ticket opened for transaction reference ' + referenceId)}
            className="w-full text-center text-xs font-semibold text-slate-600 hover:text-slate-900 underline py-1 block cursor-pointer"
          >
            Report an Issue with this transaction
          </button>
        </div>
      </div>
    </div>
  )
}
