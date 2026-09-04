import { useState } from 'react'
import { Building2, Check, CreditCard, Landmark, ShieldCheck, Sparkles } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const supportedBanks = [
  { name: 'Standard Chartered Bank', country: 'United States (ACH/FedWire)', logo: 'SC' },
  { name: 'Wema Bank (ALAT)', country: 'Nigeria (NIBSS Instant)', logo: 'WB' },
  { name: 'Barclays Bank UK', country: 'United Kingdom (FPS)', logo: 'BB' },
  { name: 'Revolut Bank UAB', country: 'European Union (SEPA Instant)', logo: 'RB' },
  { name: 'Kuda Microfinance Bank', country: 'Nigeria (NIBSS Instant)', logo: 'KB' },
  { name: 'Chase Bank NA', country: 'United States (Wire/ACH)', logo: 'CB' },
]

export default function AddRailModal({ open, onClose, onRailAdded }) {
  const toast = useToast()
  const [selectedBank, setSelectedBank] = useState(supportedBanks[0])
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('Alexander Cooper')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  function handleAccountLookup(val) {
    setAccountNumber(val)
    if (val.length >= 10) {
      setVerifying(true)
      setTimeout(() => {
        setVerifying(false)
        setAccountName('Alexander Cooper (Verified)')
      }, 500)
    }
  }

  function handleAddRail(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const newRail = {
        id: `rail_${Date.now()}`,
        name: selectedBank.name,
        initials: selectedBank.logo,
        tag: `•• ${accountNumber.slice(-4) || '7102'} (${selectedBank.country.split(' ')[0]})`,
      }
      onRailAdded?.(newRail)
      toast.success('Rail Connected', `${selectedBank.name} linked to your Universal ID.`)
      onClose()
    }, 800)
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader title="Connect Bank Account &amp; Rail" onClose={onClose} />
      <div className="p-6">
        <form onSubmit={handleAddRail} className="space-y-4">
          <p className="text-xs text-slate-500">
            Link an external bank account or fiat clearing rail for instant automated settlements.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
              Select Financial Institution / Rail
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {supportedBanks.map((b) => (
                <div
                  key={b.name}
                  onClick={() => setSelectedBank(b)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedBank.name === b.name
                      ? 'border-ink-900 bg-slate-50 ring-1 ring-ink-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-ink-100 text-ink-900 font-bold text-xs grid place-items-center">
                      {b.logo}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink-900">{b.name}</p>
                      <p className="text-[10px] text-slate-400">{b.country}</p>
                    </div>
                  </div>
                  {selectedBank.name === b.name && (
                    <div className="h-5 w-5 rounded-full bg-ink-900 text-white grid place-items-center">
                      <Check size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
              Account Number / IBAN
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => handleAccountLookup(e.target.value)}
              placeholder="1023471102"
              className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-ink-900 outline-none focus:border-ink-800"
              required
            />
          </div>

          {accountNumber.length >= 10 && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center justify-between">
              <span>Account Name:</span>
              <span className="font-bold">{accountName}</span>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            className="mt-2"
          >
            Connect &amp; Bind Rail
          </Button>
        </form>
      </div>
    </Modal>
  )
}
