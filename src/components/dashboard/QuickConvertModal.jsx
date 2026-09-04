import { useState } from 'react'
import { ArrowDown, ArrowLeftRight, Check, RefreshCw, Sparkles } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function QuickConvertModal({ open, onClose }) {
  const { fiatAccounts, digitalAssets, adjustFiatBalance } = useApp()
  const toast = useToast()

  const [fromAsset, setFromAsset] = useState('USD')
  const [toAsset, setToAsset] = useState('NGN')
  const [fromAmount, setFromAmount] = useState('100')
  const [submitting, setSubmitting] = useState(false)

  // Simulated exchange rates
  const rates = {
    USD_NGN: 1600,
    NGN_USD: 1 / 1600,
    USD_USDT: 1.0,
    USDT_USD: 1.0,
    NGN_USDT: 1 / 1600,
    USDT_NGN: 1600,
  }

  const rateKey = `${fromAsset}_${toAsset}`
  const currentRate = rates[rateKey] || 1
  const calculatedToAmount = (parseFloat(fromAmount || '0') * currentRate).toFixed(2)

  function handleSwap() {
    const prevFrom = fromAsset
    setFromAsset(toAsset)
    setToAsset(prevFrom)
  }

  function handleConvert(e) {
    e.preventDefault()
    const num = parseFloat(fromAmount)
    if (!num || num <= 0) {
      toast.error('Invalid amount', 'Please enter a valid amount to swap.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      toast.success(
        'Conversion Successful!',
        `Converted ${fromAsset} ${num} to ${toAsset} ${parseFloat(calculatedToAmount).toLocaleString()}.`
      )
      onClose()
    }, 800)
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title="Instant Currency Swap" onClose={onClose} />
      <div className="p-6">
        <form onSubmit={handleConvert} className="space-y-4">
          {/* From Box */}
          <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50/50">
            <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-1">
              <span>You Pay</span>
              <span>Available: 2,100.50 {fromAsset}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-xl font-black text-ink-900 outline-none"
                required
              />
              <select
                value={fromAsset}
                onChange={(e) => setFromAsset(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink-900 outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="NGN">NGN (₦)</option>
                <option value="USDT">USDT (₮)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              type="button"
              onClick={handleSwap}
              className="h-9 w-9 rounded-full bg-white border border-slate-200 hover:bg-slate-50 shadow-sm grid place-items-center text-ink-800 transition-transform hover:scale-110 active:scale-95"
            >
              <ArrowDown size={16} />
            </button>
          </div>

          {/* To Box */}
          <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50/50">
            <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-1">
              <span>You Receive (Estimated)</span>
              <span>Rate: 1 {fromAsset} = {currentRate.toLocaleString()} {toAsset}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={parseFloat(calculatedToAmount).toLocaleString()}
                readOnly
                className="w-full bg-transparent text-xl font-black text-emerald-600 outline-none"
              />
              <select
                value={toAsset}
                onChange={(e) => setToAsset(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink-900 outline-none"
              >
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
                <option value="USDT">USDT (₮)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-2.5 flex items-center gap-2 text-xs text-amber-900">
            <Sparkles size={14} className="text-amber-600 shrink-0" />
            <span>Guaranteed zero slippage spot price via institutional liquidity.</span>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={submitting}
            className="mt-2"
          >
            Confirm Swap Now
          </Button>
        </form>
      </div>
    </Modal>
  )
}
