import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, ChevronRight, QrCode, Search } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Modal, { ModalHeader } from '../components/ui/Modal.jsx'
import SuccessReceiptModal from '../components/common/SuccessReceiptModal.jsx'
import ContactCard from '../components/send/ContactCard.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const TABS = [
  { id: 'contact', label: 'Send to Contact' },
  { id: 'external', label: 'Send to External Wallet' },
]

export default function SendMoney() {
  const { recentContacts, myContacts, fiatAccounts, digitalAssets, sendToContact, sendToExternalWallet } =
    useApp()
  const toast = useToast()
  const navigate = useNavigate()

  const [tab, setTab] = useState('contact')

  // --- Send to contact state ---
  const [query, setQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState(recentContacts[0])
  const [amount, setAmount] = useState('450.00')
  const [currency, setCurrency] = useState('USD')
  const [remark, setRemark] = useState('')

  // --- Send to external wallet state ---
  const [asset, setAsset] = useState(digitalAssets[2]) // BTC by default
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState('Bitcoin Mainnet')
  const [cryptoAmount, setCryptoAmount] = useState('0.002')

  const [reviewOpen, setReviewOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [receipt, setReceipt] = useState(null)

  const account = fiatAccounts.find((a) => a.code === currency)
  const filteredContacts = myContacts.filter((c) =>
    `${c.name} ${c.phone}`.toLowerCase().includes(query.toLowerCase())
  )

  function openReview(e) {
    e.preventDefault()
    if (tab === 'contact' && (!selectedContact || !amount)) return
    if (tab === 'external' && (!address || !cryptoAmount)) return
    setReviewOpen(true)
  }

  function confirmTransfer() {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setReviewOpen(false)
      if (tab === 'contact') {
        const r = sendToContact({
          recipient: selectedContact,
          amount: parseFloat(amount),
          currency,
          remark,
        })
        setReceipt(r)
      } else {
        const r = sendToExternalWallet({
          asset: asset.code,
          address,
          network,
          amount: parseFloat(cryptoAmount),
          remark,
        })
        setReceipt(r)
      }
    }, 1200)
  }

  return (
    <DashboardLayout title="Send Money">
      <div className="flex items-center gap-6 border-b border-slate-100 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? 'border-ink-800 text-ink-900'
                : 'border-transparent text-slate-400 hover:text-ink-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {tab === 'contact' ? (
          <Card>
            <p className="text-sm font-semibold text-ink-900 mb-2">Recipient</p>
            <Input
              icon={Search}
              placeholder="Search by phone number or name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <p className="text-sm font-semibold text-ink-900 mt-6 mb-3">Recent Contacts</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {recentContacts.map((c) => (
                <ContactCard
                  key={c.id}
                  contact={c}
                  selected={selectedContact?.id === c.id}
                  onClick={setSelectedContact}
                />
              ))}
            </div>

            <p className="text-sm font-semibold text-ink-900 mt-6 mb-3">My Contacts</p>
            <div className="divide-y divide-slate-50">
              {(query ? filteredContacts : myContacts).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedContact(c)}
                  className="w-full flex items-center gap-3 py-3 text-left hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-ink-50 text-ink-700 grid place-items-center text-xs font-bold shrink-0">
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.phone}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <p className="text-sm font-semibold text-ink-900 mb-2">Select Crypto Asset</p>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3 mb-5">
              <select
                value={asset.code}
                onChange={(e) => setAsset(digitalAssets.find((a) => a.code === e.target.value))}
                className="font-semibold text-ink-900 bg-transparent outline-none"
              >
                {digitalAssets.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.code} — {a.name}
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-400">
                Bal: {asset.balance} {asset.code}
              </span>
            </div>

            <Input
              label="Recipient Wallet Address"
              placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              icon={QrCode}
            />

            <label className="block mt-5">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Transfer Network
              </span>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-200 px-3.5 text-[15px] outline-none focus:border-ink-500 focus:ring-2 focus:ring-ink-100"
              >
                <option>Bitcoin Mainnet</option>
                <option>Ethereum (ERC-20)</option>
                <option>Tron (TRC-20)</option>
              </select>
            </label>

            <label className="block mt-5">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Transfer Amount
              </span>
              <div className="flex items-center rounded-xl border border-slate-200 px-3.5 h-14 focus-within:border-ink-500 focus-within:ring-2 focus-within:ring-ink-100">
                <input
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(e.target.value)}
                  className="flex-1 min-w-0 text-2xl font-bold text-ink-900 outline-none"
                />
                <span className="text-sm font-semibold text-slate-400">{asset.code}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Equivalent: ~${(parseFloat(cryptoAmount || 0) * (asset.usdEquivalent / asset.balance || 0)).toFixed(2)} USD
              </p>
            </label>

            <Input
              label="Remark"
              placeholder="Add remark here"
              className="mt-5"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Card>
        )}

        <div className="space-y-4">
          {tab === 'contact' ? (
            <Card>
              <div className="rounded-xl bg-ink-50 px-4 py-3 mb-4">
                <p className="text-sm font-semibold text-ink-900">
                  {selectedContact?.name || 'Select a recipient'}
                </p>
                <p className="text-xs text-slate-400">{selectedContact?.phone}</p>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Send Amount
              </p>
              <div className="flex items-center rounded-xl border border-slate-200 px-3.5 h-14 focus-within:border-ink-500 focus-within:ring-2 focus-within:ring-ink-100">
                <span className="text-slate-400 mr-1">$</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 min-w-0 text-2xl font-bold text-ink-900 outline-none"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="text-sm font-semibold text-ink-800 bg-slate-50 rounded-lg px-2 py-1 outline-none"
                >
                  {fiatAccounts.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs">
                <span className="text-slate-400">
                  Available: {account?.symbol}
                  {account?.balance.toLocaleString()} {account?.code}
                </span>
                <button
                  onClick={() => setAmount(String(account?.balance || 0))}
                  className="font-semibold text-ink-800"
                >
                  USE MAX
                </button>
              </div>

              <Input
                label="Remark"
                placeholder="Add remark here"
                className="mt-4"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />

              <div className="mt-5 space-y-2 text-sm border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transfer Speed</span>
                  <span className="font-semibold text-emerald-600">Instant Atomic Settlement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Network Fee</span>
                  <span className="font-semibold text-ink-900">$0.00 (UMEPAY Network)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Arrival</span>
                  <span className="font-semibold text-ink-900">~1.5 Seconds</span>
                </div>
              </div>

              <Button fullWidth className="mt-5" icon={ArrowRight} iconPosition="right" onClick={openReview}>
                Review Transfer
              </Button>
            </Card>
          ) : (
            <>
              <Card className="!bg-rose-50 border-rose-100">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-rose-700">Critical Security Warning</p>
                    <p className="text-xs text-rose-600 mt-1 leading-relaxed">
                      External blockchain transfers are absolutely irreversible. Please verify the
                      destination address and the selected network multiple times before review.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <p className="text-sm font-semibold text-ink-900 mb-3">Transaction Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transfer Amount</span>
                    <span className="font-semibold text-ink-900">
                      {cryptoAmount} {asset.code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Network Fee</span>
                    <span className="font-semibold text-ink-900">0.00005 {asset.code}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-400">Total Debit Amount</span>
                    <span className="font-semibold text-ink-900">
                      {(parseFloat(cryptoAmount || 0) + 0.00005).toFixed(5)} {asset.code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected Arrival</span>
                    <span className="font-semibold text-ink-900">~1.5 Seconds</span>
                  </div>
                </div>
                <Button fullWidth className="mt-5" onClick={openReview}>
                  Review Transfer
                </Button>
              </Card>
            </>
          )}
        </div>
      </div>

      <Modal open={reviewOpen} onClose={() => !processing && setReviewOpen(false)} size="sm">
        <ModalHeader
          title="Confirm Transfer"
          onClose={() => !processing && setReviewOpen(false)}
        />
        <div className="p-6 pt-4">
          <div className="rounded-xl border border-slate-100 divide-y divide-slate-100 text-sm mb-6">
            <div className="flex justify-between px-4 py-2.5">
              <span className="text-slate-400">Recipient</span>
              <span className="font-semibold text-ink-900">
                {tab === 'contact' ? selectedContact?.name : `${address.slice(0, 10)}…`}
              </span>
            </div>
            <div className="flex justify-between px-4 py-2.5">
              <span className="text-slate-400">Amount</span>
              <span className="font-semibold text-ink-900">
                {tab === 'contact' ? `$${amount} ${currency}` : `${cryptoAmount} ${asset.code}`}
              </span>
            </div>
            <div className="flex justify-between px-4 py-2.5">
              <span className="text-slate-400">Speed</span>
              <span className="font-semibold text-ink-900">~1.5 seconds</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="outline" onClick={() => setReviewOpen(false)} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={confirmTransfer} loading={processing}>
              Confirm &amp; Send
            </Button>
          </div>
        </div>
      </Modal>

      <SuccessReceiptModal
        open={!!receipt}
        onClose={() => setReceipt(null)}
        title="Transfer Successful"
        message={
          tab === 'contact'
            ? `Your funds have been securely settled on ${receipt?.recipient}'s wallet.`
            : 'Your funds have been broadcast to the network.'
        }
        rows={
          receipt
            ? [
                {
                  label: 'Amount Sent',
                  value: `${receipt.amount} ${receipt.currency}`,
                },
                { label: 'Recipient', value: receipt.recipient },
                { label: 'Reference ID', value: receipt.reference },
                { label: 'Settlement Date', value: receipt.settlementDate || 'Today' },
                { label: 'Status', value: 'Successful' },
              ]
            : []
        }
        primaryLabel="Back to Dashboard"
        onPrimary={() => {
          setReceipt(null)
          toast.success('Transfer complete', 'Funds have been settled.')
          navigate('/dashboard')
        }}
      />
    </DashboardLayout>
  )
}
