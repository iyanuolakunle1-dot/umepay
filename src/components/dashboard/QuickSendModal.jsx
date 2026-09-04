import { useState } from 'react'
import { ArrowRight, Building2, Check, Phone, ShieldCheck, Wallet, X } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import CountryCodeDropdown from '../common/CountryCodeDropdown.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function QuickSendModal({ open, onClose }) {
  const { user, fiatAccounts, sendToContact } = useApp()
  const toast = useToast()

  const [mode, setMode] = useState('phone') // 'phone' | 'bank' | 'crypto'
  const [countryCode, setCountryCode] = useState('+234')
  const [recipient, setRecipient] = useState('809 123 4567')
  const [recipientName, setRecipientName] = useState('Chioma Eze')
  const [amount, setAmount] = useState('50000')
  const [currency, setCurrency] = useState('NGN')
  const [remark, setRemark] = useState('Dinner / Project payout')
  const [submitting, setSubmitting] = useState(false)
  const [successReceipt, setSuccessReceipt] = useState(null)

  const ngnAccount = fiatAccounts.find((a) => a.code === 'NGN')
  const usdAccount = fiatAccounts.find((a) => a.code === 'USD')

  function handleSend(e) {
    e.preventDefault()
    const num = parseFloat(amount)
    if (!num || num <= 0) {
      toast.error('Invalid amount', 'Please enter a valid transfer amount.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      const receipt = sendToContact({
        recipient: { name: recipientName, phone: recipient },
        amount: num,
        currency,
        remark,
      })
      setSuccessReceipt(receipt)
      toast.success('Transfer Successful!', `Sent ${currency} ${num.toLocaleString()} to ${recipientName}.`)
    }, 900)
  }

  function handleClose() {
    setSuccessReceipt(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <ModalHeader title={successReceipt ? 'Transfer Receipt' : 'Send Money'} onClose={handleClose} />
      <div className="p-6">
        {successReceipt ? (
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto shadow-xs">
              <Check size={32} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-ink-900">Transfer Completed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Settled instantly via UMEPAY Universal Routing.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-left border border-slate-100 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Sent</span>
                <span className="font-bold text-ink-900 text-sm">
                  {successReceipt.currency} {successReceipt.amount.toLocaleString()}.00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient</span>
                <span className="font-bold text-ink-900">{successReceipt.recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference Number</span>
                <span className="font-mono text-ink-800">{successReceipt.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Routing Network</span>
                <span className="font-bold text-emerald-600">Zero-Fee Universal Rail</span>
              </div>
            </div>

            <Button fullWidth onClick={handleClose} className="mt-2">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {/* Method switch */}
            <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('phone')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 ${
                  mode === 'phone' ? 'bg-white text-ink-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Phone size={13} /> Phone ID
              </button>
              <button
                type="button"
                onClick={() => setMode('bank')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 ${
                  mode === 'bank' ? 'bg-white text-ink-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Building2 size={13} /> Bank Rail
              </button>
              <button
                type="button"
                onClick={() => setMode('crypto')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 ${
                  mode === 'crypto' ? 'bg-white text-ink-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Wallet size={13} /> Crypto / USDT
              </button>
            </div>

            {/* Recipient input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                {mode === 'phone' ? "Recipient's Universal Phone" : mode === 'bank' ? 'Account Number & Bank' : 'Wallet Address / ENS'}
              </label>
              {mode === 'phone' ? (
                <div className="flex items-center h-11 rounded-xl border border-slate-200 px-3 gap-2 focus-within:border-ink-800">
                  <CountryCodeDropdown
                    value={countryCode}
                    onChange={(val) => setCountryCode(val)}
                  />
                  <span className="h-4 w-px bg-slate-200" />
                  <input
                    type="tel"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="809 123 4567"
                    className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none"
                    required
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={mode === 'bank' ? '0123456789 (Access Bank)' : '0x71C...3a9 or satoshi.eth'}
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-ink-900 outline-none focus:border-ink-800"
                  required
                />
              )}
            </div>

            {/* Currency and Amount */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                  Asset
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 px-2.5 text-sm font-bold text-ink-900 bg-white outline-none focus:border-ink-800"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="USDT">USDT (₮)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50,000"
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-extrabold text-ink-900 outline-none focus:border-ink-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                Note / Remark (Optional)
              </label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Payment reference"
                className="w-full h-11 rounded-xl border border-slate-200 px-3 text-xs text-ink-900 outline-none focus:border-ink-800"
              />
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 space-y-1.5 border border-slate-100">
              <div className="flex justify-between">
                <span>Network Fee</span>
                <span className="font-bold text-emerald-600">Free ($0.00)</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Speed</span>
                <span className="font-bold text-ink-900">Instant (Real-Time)</span>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={submitting}
              icon={ArrowRight}
              iconPosition="right"
              className="mt-2"
            >
              Confirm &amp; Send Now
            </Button>
          </form>
        )}
      </div>
    </Modal>
  )
}
