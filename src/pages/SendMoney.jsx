import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Grid2X2,
  QrCode,
  Search,
  ShieldAlert,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Button from '../components/ui/Button.jsx'
import ContactCard from '../components/send/ContactCard.jsx'
import QrScannerModal from '../components/send/QrScannerModal.jsx'
import PinAuthModal from '../components/send/PinAuthModal.jsx'
import ProfessionalReceiptModal from '../components/send/ProfessionalReceiptModal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

// ─── Nigerian banks list (for fiat external transfers) ───────────────────────
const NIGERIAN_BANKS = [
  'Access Bank',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Globus Bank',
  'Guaranty Trust Bank (GTB)',
  'Heritage Bank',
  'Keystone Bank',
  'Kuda Microfinance Bank',
  'Opay',
  'Palmpay',
  'Polaris Bank',
  'Premium Trust Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'SunTrust Bank',
  'Titan Trust Bank',
  'Union Bank',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
]

// ─── Networks per crypto asset ────────────────────────────────────────────────
const CRYPTO_NETWORKS = {
  BTC:  ['Bitcoin Mainnet', 'Bitcoin Testnet'],
  ETH:  ['Ethereum (ERC-20)', 'Polygon POS', 'Arbitrum One', 'Optimism'],
  USDT: ['Tron (TRC-20)', 'Ethereum (ERC-20)', 'BNB Smart Chain (BEP-20)', 'Solana'],
  USDC: ['Ethereum (ERC-20)', 'Solana', 'Polygon POS', 'Arbitrum One'],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtBal(account) {
  return `${account.symbol}${account.balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function fmtCrypto(asset) {
  return `${asset.balance} ${asset.code}`
}

// Build a unified wallet list for the source-wallet dropdown
function buildWalletList(fiatAccounts, digitalAssets) {
  const fiats = fiatAccounts.map(a => ({
    id: a.id,
    code: a.code,
    label: `${a.name} (${a.code})`,
    balanceLabel: `Bal: ${fmtBal(a)}`,
    isCrypto: false,
    raw: a,
  }))
  const crypto = digitalAssets.map(a => ({
    id: a.id,
    code: a.code,
    label: a.name,
    balanceLabel: `Bal: ${fmtCrypto(a)}`,
    isCrypto: true,
    raw: a,
  }))
  return [...fiats, ...crypto]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Styled select that matches the screenshot's wallet/bank dropdown style
 */
function StyledSelect({ value, onChange, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm font-semibold text-ink-900 outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-100 appearance-none cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  )
}

/**
 * Labeled form field wrapper
 */
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-ink-900">{label}</label>
      {children}
    </div>
  )
}

/**
 * Currency-tagged amount input (fiat)
 */
function FiatAmountInput({ symbol, value, onChange, currency, usdRate, onMax }) {
  const usdEq = usdRate && value ? (parseFloat(value) / usdRate).toFixed(2) : null
  return (
    <div>
      <div className="flex items-center h-14 rounded-xl border border-slate-200 bg-white px-4 gap-3 focus-within:border-ink-700 focus-within:ring-2 focus-within:ring-ink-100 transition-colors">
        <span className="text-2xl font-bold text-ink-900 shrink-0">{symbol}</span>
        <input
          type="number"
          min="0"
          value={value}
          onChange={onChange}
          placeholder="0.00"
          className="flex-1 min-w-0 text-2xl font-bold text-ink-900 outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={onMax}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-ink-800 transition-colors cursor-pointer"
        >
          MAX
        </button>
      </div>
      {usdEq && (
        <p className="text-xs text-slate-400 mt-1.5">≈ ${usdEq} USD equivalent</p>
      )}
    </div>
  )
}

/**
 * Crypto amount input
 */
function CryptoAmountInput({ value, onChange, code, usdPerUnit, onMax }) {
  const usdEq = usdPerUnit && value ? `~$${(parseFloat(value || 0) * usdPerUnit).toFixed(2)} USD` : null
  const networkFee = code === 'BTC' ? '0.00005' : code === 'ETH' ? '0.0005' : '0.50'
  const feeLabel   = `${networkFee} ${code}`
  return (
    <div>
      <div className="flex items-center h-14 rounded-xl border border-slate-200 bg-white px-4 gap-3 focus-within:border-ink-700 focus-within:ring-2 focus-within:ring-ink-100 transition-colors">
        <input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={onChange}
          placeholder="0.00"
          className="flex-1 min-w-0 text-2xl font-bold text-ink-900 outline-none bg-transparent"
        />
        <span className="shrink-0 text-sm font-bold text-ink-800 bg-slate-100 px-3 py-1.5 rounded-lg">
          {code}
        </span>
        <button
          type="button"
          onClick={onMax}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-ink-800 transition-colors cursor-pointer"
        >
          Max
        </button>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1.5">
        {usdEq && <span>Equivalent: {usdEq}</span>}
        <span>Network fee estimate: {feeLabel}</span>
      </div>
    </div>
  )
}

/**
 * Source Wallet Picker — pill badge + name + balance
 */
function WalletPicker({ wallets, selectedId, onChange }) {
  const selected = wallets.find(w => w.id === selectedId) || wallets[0]
  return (
    <div className="relative">
      <select
        value={selectedId}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-14 pr-9 text-sm font-semibold text-ink-900 outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-100 appearance-none cursor-pointer"
      >
        {wallets.map(w => (
          <option key={w.id} value={w.id}>
            {w.label} — {w.balanceLabel}
          </option>
        ))}
      </select>
      {/* Code badge overlay */}
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-ink-100 text-ink-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md tracking-wide">
        {selected.code}
      </span>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SendMoney() {
  const {
    user,
    recentContacts,
    myContacts,
    fiatAccounts,
    digitalAssets,
    sendToContact,
    sendToExternalWallet,
  } = useApp()
  const toast    = useToast()
  const navigate = useNavigate()

  // Primary tab
  const [tab, setTab] = useState('external') // 'contact' | 'external'

  // ── Send-to-Contact state ──────────────────────────────────────────────────
  const [searchContact, setSearchContact] = useState('')
  const [selectedContact, setSelectedContact] = useState(recentContacts[0])
  const [contactAmount, setContactAmount] = useState('')
  const [contactCurrency, setContactCurrency] = useState('NGN')
  const [contactRemark, setContactRemark] = useState('')

  // ── Send-to-External state ─────────────────────────────────────────────────
  const wallets      = useMemo(() => buildWalletList(fiatAccounts, digitalAssets), [fiatAccounts, digitalAssets])
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? '')
  const activeWallet = wallets.find(w => w.id === walletId) || wallets[0]
  const isCrypto     = activeWallet?.isCrypto ?? false

  // Fiat-external fields
  const [bankName,      setBankName]      = useState('Wema Bank')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName,   setAccountName]   = useState('')
  const [fiatAmount,    setFiatAmount]     = useState('')
  const [fiatRemark,    setFiatRemark]     = useState('')

  // Crypto-external fields
  const [cryptoAddress, setCryptoAddress] = useState('')
  const [network,       setNetwork]       = useState('')
  const [cryptoAmount,  setCryptoAmount]  = useState('')
  const [cryptoRemark,  setCryptoRemark]  = useState('')

  // When wallet changes, reset & set default network
  function handleWalletChange(id) {
    setWalletId(id)
    const w = wallets.find(x => x.id === id)
    if (w?.isCrypto) {
      const nets = CRYPTO_NETWORKS[w.code] || []
      setNetwork(nets[0] || '')
    }
    setFiatAmount(''); setCryptoAmount('')
  }

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [isQrOpen,      setIsQrOpen]      = useState(false)
  const [isReviewOpen,  setIsReviewOpen]  = useState(false)
  const [isPinOpen,     setIsPinOpen]     = useState(false)
  const [processing,    setProcessing]    = useState(false)
  const [receipt,       setReceipt]       = useState(null)

  // ── Memos ──────────────────────────────────────────────────────────────────
  const filteredContacts = useMemo(() => {
    if (!searchContact) return myContacts
    const q = searchContact.toLowerCase()
    return myContacts.filter(c => `${c.name} ${c.phone}`.toLowerCase().includes(q))
  }, [myContacts, searchContact])

  // Account name lookup simulation
  const resolvedName = useMemo(() => {
    if (accountNumber.length >= 10) return 'John Doe'
    return null
  }, [accountNumber])

  // ── Derived transfer breakdown ─────────────────────────────────────────────
  const breakdown = useMemo(() => {
    if (tab === 'contact') {
      const acc   = fiatAccounts.find(a => a.code === contactCurrency) || fiatAccounts[0]
      const amt   = parseFloat(contactAmount) || 0
      const fee   = 0
      return {
        transferAmount: `${acc.symbol}${amt.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
        fee:            `${acc.symbol}0.00 (Zero Fee)`,
        total:          `${acc.symbol}${(amt + fee).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
        arrival:        '~Instant',
        isCrypto:       false,
      }
    }

    if (isCrypto) {
      const asset = activeWallet.raw
      const amt   = parseFloat(cryptoAmount) || 0
      const fee   = asset.code === 'BTC' ? 0.00005 : asset.code === 'ETH' ? 0.0005 : 0.5
      return {
        transferAmount: `${amt} ${asset.code}`,
        fee:            `${fee} ${asset.code}`,
        total:          `${(amt + fee).toFixed(asset.code === 'BTC' ? 5 : 2)} ${asset.code}`,
        arrival:        '~1.5 Seconds',
        isCrypto:       true,
      }
    }

    // Fiat external (bank transfer)
    const acc = activeWallet.raw
    const amt = parseFloat(fiatAmount) || 0
    const fee = 50 // flat bank fee in NGN (adjust per currency if needed)
    return {
      transferAmount: `${acc.symbol}${amt.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
      fee:            `${acc.symbol}${fee.toLocaleString()}`,
      total:          `${acc.symbol}${(amt + fee).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
      arrival:        '~1 Business Day',
      isCrypto:       false,
    }
  }, [tab, contactAmount, contactCurrency, fiatAmount, cryptoAmount, isCrypto, activeWallet, fiatAccounts])

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleContactSelect(c) {
    setSelectedContact(c)
  }

  function handleOpenReview() {
    if (tab === 'contact') {
      if (!selectedContact) return toast.error('No Recipient', 'Select a contact to send to.')
      if (!contactAmount || parseFloat(contactAmount) <= 0) return toast.error('Invalid Amount', 'Enter a valid amount.')
    } else if (isCrypto) {
      if (!cryptoAddress) return toast.error('Missing Address', 'Enter the recipient wallet address.')
      if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) return toast.error('Invalid Amount', 'Enter a valid amount.')
    } else {
      if (!accountNumber || accountNumber.length < 10) return toast.error('Invalid Account', 'Enter a valid 10-digit account number.')
      if (!fiatAmount || parseFloat(fiatAmount) <= 0) return toast.error('Invalid Amount', 'Enter a valid amount.')
    }
    setIsReviewOpen(true)
  }

  function handleProceedToPin() {
    setIsReviewOpen(false)
    setIsPinOpen(true)
  }

  function handlePinAuthorized() {
    setIsPinOpen(false)
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      if (tab === 'contact') {
        const acc = fiatAccounts.find(a => a.code === contactCurrency) || fiatAccounts[0]
        const r   = sendToContact({
          recipient: { name: selectedContact.name, phone: selectedContact.phone },
          amount:    parseFloat(contactAmount),
          currency:  contactCurrency,
          remark:    contactRemark,
        })
        setReceipt({ ...r, rail: 'UMEPAY Instant Rail', recipient: `${selectedContact.name} (${selectedContact.phone})` })
      } else if (isCrypto) {
        const r = sendToExternalWallet({
          asset:   activeWallet.code,
          address: cryptoAddress,
          network,
          amount:  parseFloat(cryptoAmount),
          remark:  cryptoRemark,
        })
        setReceipt({ ...r, rail: `${network} Blockchain`, recipient: `${cryptoAddress.slice(0, 10)}...${cryptoAddress.slice(-6)}` })
      } else {
        const r = sendToContact({
          recipient: { name: accountName || resolvedName || 'Beneficiary', phone: `${bankName} • ${accountNumber}` },
          amount:    parseFloat(fiatAmount),
          currency:  activeWallet.code,
          remark:    fiatRemark,
        })
        setReceipt({ ...r, rail: `Bank Transfer (${bankName})`, recipient: `${resolvedName || accountName} (${bankName} - ${accountNumber.slice(-4)})` })
      }
      toast.success('Transfer Sent!', 'Your transfer has been dispatched.')
    }, 900)
  }

  // ── Computed values for PIN modal ──────────────────────────────────────────
  const pinTransferDetails = {
    amountFormatted: breakdown.total,
    recipientName:   tab === 'contact'
      ? selectedContact?.name
      : isCrypto
        ? cryptoAddress?.slice(0, 16) + '...'
        : accountName || resolvedName || 'Beneficiary',
  }

  // ── Fiat usdRate for equivalent display ────────────────────────────────────
  const fiatUsdRate = useMemo(() => {
    if (!activeWallet?.isCrypto) {
      const acc = activeWallet?.raw
      if (acc?.code === 'NGN') return acc.balance / acc.usdEquivalent
      if (acc?.code === 'GBP') return 1 / 1.27
      if (acc?.code === 'EUR') return 1 / 1.09
      return 1
    }
    return null
  }, [activeWallet])

  const cryptoUsdPerUnit = useMemo(() => {
    if (!activeWallet?.isCrypto) return null
    const asset = activeWallet.raw
    return asset.balance > 0 ? asset.usdEquivalent / asset.balance : 0
  }, [activeWallet])

  const networkOptions = isCrypto ? (CRYPTO_NETWORKS[activeWallet?.code] || []) : []

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Send">
      <h1 className="text-2xl font-black text-ink-900 tracking-tight mb-6">Send Money</h1>

      {/* ── Tab bar ── */}
      <div className="flex border-b border-slate-200 mb-6 gap-6">
        {[
          { id: 'contact',  label: 'Send to Contact'  },
          { id: 'external', label: 'Send to External' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
              tab === id
                ? 'text-ink-900 border-b-2 border-ink-900 -mb-px'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* ════════════════════════════ LEFT PANEL ════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 space-y-5">

          {/* ── SEND TO CONTACT ── */}
          {tab === 'contact' && (
            <>
              {/* Recent contacts pills */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Recent Contacts
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {recentContacts.map(c => (
                    <ContactCard
                      key={c.id}
                      contact={c}
                      selected={selectedContact?.id === c.id}
                      onClick={handleContactSelect}
                    />
                  ))}
                </div>
              </div>

              {/* Search contacts */}
              <div className="pt-2 border-t border-slate-100">
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchContact}
                    onChange={e => setSearchContact(e.target.value)}
                    placeholder="Search contacts by name or phone..."
                    className="w-full h-10 rounded-xl border border-slate-200 pl-9 pr-3 text-sm font-medium text-ink-900 outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-100"
                  />
                </div>
                <div className="max-h-44 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-100">
                  {filteredContacts.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleContactSelect(c)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-50 transition-colors cursor-pointer text-xs ${selectedContact?.id === c.id ? 'bg-ink-50' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 rounded-full bg-ink-100 text-ink-800 font-bold text-[10px] grid place-items-center shrink-0">
                          {c.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-ink-900 truncate">{c.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{c.phone}</p>
                        </div>
                      </div>
                      {selectedContact?.id === c.id
                        ? <Check size={14} className="text-emerald-500 shrink-0" />
                        : <ChevronRight size={14} className="text-slate-300 shrink-0" />
                      }
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected recipient chip */}
              {selectedContact && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-ink-900">{selectedContact.name}</span>
                    <span className="text-slate-500 ml-1">({selectedContact.phone})</span>
                  </div>
                </div>
              )}

              {/* Amount */}
              <Field label="Transfer Amount">
                <FiatAmountInput
                  symbol={fiatAccounts.find(a => a.code === contactCurrency)?.symbol || '$'}
                  value={contactAmount}
                  onChange={e => setContactAmount(e.target.value)}
                  currency={contactCurrency}
                  usdRate={contactCurrency === 'NGN' ? 1590 : contactCurrency === 'GBP' ? 0.79 : 1}
                  onMax={() => {
                    const acc = fiatAccounts.find(a => a.code === contactCurrency) || fiatAccounts[0]
                    setContactAmount(String(acc.balance))
                  }}
                />
              </Field>

              {/* Currency picker */}
              <Field label="Currency">
                <StyledSelect value={contactCurrency} onChange={e => setContactCurrency(e.target.value)}>
                  {fiatAccounts.map(a => (
                    <option key={a.code} value={a.code}>{a.code} — {a.name}</option>
                  ))}
                </StyledSelect>
              </Field>

              {/* Remark */}
              <Field label="Remark">
                <input
                  type="text"
                  value={contactRemark}
                  onChange={e => setContactRemark(e.target.value)}
                  placeholder="Add remark here"
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-medium text-ink-900 outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-100"
                />
              </Field>
            </>
          )}

          {/* ── SEND TO EXTERNAL ── */}
          {tab === 'external' && (
            <>
              {/* Source Wallet */}
              <Field label="Source Wallet">
                <WalletPicker
                  wallets={wallets}
                  selectedId={walletId}
                  onChange={handleWalletChange}
                />
              </Field>

              {/* ── CRYPTO FLOW ── */}
              {isCrypto && (
                <>
                  {/* Recipient Wallet Address */}
                  <Field label="Recipient Wallet Address">
                    <div className="flex items-center h-12 rounded-xl border border-slate-200 bg-white px-3 gap-2 focus-within:border-ink-700 focus-within:ring-2 focus-within:ring-ink-100 transition-colors">
                      <input
                        type="text"
                        value={cryptoAddress}
                        onChange={e => setCryptoAddress(e.target.value)}
                        placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493..."
                        className="flex-1 min-w-0 text-xs font-mono font-semibold text-ink-900 outline-none bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.readText?.().then(t => setCryptoAddress(t)).catch(() => {})
                        }}
                        className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-ink-800 cursor-pointer"
                      >
                        Paste
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsQrOpen(true)}
                        className="shrink-0 text-slate-400 hover:text-ink-900 cursor-pointer"
                        aria-label="Scan QR code"
                      >
                        <Grid2X2 size={16} />
                      </button>
                    </div>
                  </Field>

                  {/* Transfer Network */}
                  <Field label="Transfer Network">
                    <StyledSelect
                      value={network}
                      onChange={e => setNetwork(e.target.value)}
                    >
                      {networkOptions.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </StyledSelect>
                  </Field>

                  {/* Transfer Amount */}
                  <Field label="Transfer Amount">
                    <CryptoAmountInput
                      value={cryptoAmount}
                      onChange={e => setCryptoAmount(e.target.value)}
                      code={activeWallet.code}
                      usdPerUnit={cryptoUsdPerUnit}
                      onMax={() => setCryptoAmount(String(activeWallet.raw.balance))}
                    />
                  </Field>

                  {/* Remark */}
                  <Field label="Remark">
                    <input
                      type="text"
                      value={cryptoRemark}
                      onChange={e => setCryptoRemark(e.target.value)}
                      placeholder="Add remark here"
                      className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-medium text-ink-900 outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-100"
                    />
                  </Field>
                </>
              )}

              {/* ── FIAT BANK TRANSFER FLOW ── */}
              {!isCrypto && (
                <>
                  {/* Recipient Details heading */}
                  <p className="text-base font-bold text-ink-900 -mb-1">Recipient Details</p>

                  {/* Bank Name */}
                  <Field label="Bank Name">
                    <StyledSelect value={bankName} onChange={e => { setBankName(e.target.value); setAccountName(''); setAccountNumber('') }}>
                      {NIGERIAN_BANKS.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </StyledSelect>
                  </Field>

                  {/* Account Number */}
                  <Field label="Account Number">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="0123456789"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-mono font-semibold text-ink-900 outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-100"
                    />
                    {/* Resolved account name */}
                    {resolvedName && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 font-semibold">
                        <Check size={13} /> {resolvedName}
                      </div>
                    )}
                  </Field>

                  {/* Transfer Amount */}
                  <Field label="Transfer Amount">
                    <FiatAmountInput
                      symbol={activeWallet.raw?.symbol || '₦'}
                      value={fiatAmount}
                      onChange={e => setFiatAmount(e.target.value)}
                      currency={activeWallet.code}
                      usdRate={fiatUsdRate}
                      onMax={() => setFiatAmount(String(activeWallet.raw?.balance || 0))}
                    />
                  </Field>

                  {/* Remark */}
                  <Field label="Remark">
                    <input
                      type="text"
                      value={fiatRemark}
                      onChange={e => setFiatRemark(e.target.value)}
                      placeholder="Add remark here"
                      className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-medium text-ink-900 outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-100"
                    />
                  </Field>
                </>
              )}
            </>
          )}
        </div>

        {/* ════════════════════════════ RIGHT PANEL ════════════════════════════ */}
        <div className="space-y-4">

          {/* Security warning — shown for External tab only */}
          {tab === 'external' && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
              <ShieldAlert size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700 mb-1">Critical Security Warning</p>
                <p className="text-xs text-red-600 leading-relaxed">
                  External {isCrypto ? 'blockchain' : 'bank'} transfers are absolutely irreversible.
                  Please verify the {isCrypto ? 'destination address and the selected network' : 'bank name and account number'} multiple times before review.
                </p>
              </div>
            </div>
          )}

          {/* Transaction Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-ink-900">Transaction Breakdown</h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Transfer Amount</span>
                <span className="font-semibold text-ink-900">{breakdown.transferAmount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{isCrypto && tab === 'external' ? 'Network Fee' : 'Bank Transfer Fee'}</span>
                <span className="font-semibold text-ink-900">{breakdown.fee}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-ink-900">
                {tab === 'external' && isCrypto ? 'Total Debit Amount' : 'Total Debit'}
              </span>
              <span className="text-xl font-black text-ink-900">{breakdown.total}</span>
            </div>

            <div className="flex justify-between text-xs text-slate-400">
              <span>Expected Arrival</span>
              <span className="font-semibold text-ink-900">{breakdown.arrival}</span>
            </div>

            <Button
              fullWidth
              size="lg"
              className="mt-1"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleOpenReview}
            >
              Review Transfer
            </Button>
          </div>
        </div>
      </div>

      {/* ── Review Confirmation Modal ── */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-popover w-full max-w-sm p-6 animate-scale-in">
            <h2 className="text-base font-bold text-ink-900 mb-4">Confirm Transfer Details</h2>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2.5 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient</span>
                <span className="font-bold text-ink-900">
                  {tab === 'contact'
                    ? selectedContact?.name
                    : isCrypto
                      ? `${cryptoAddress.slice(0, 14)}...`
                      : resolvedName || accountName || 'Beneficiary'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Amount</span>
                <span className="font-extrabold text-ink-900 text-sm">{breakdown.total}</span>
              </div>
              {tab === 'external' && isCrypto && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Network</span>
                  <span className="font-bold text-ink-900">{network}</span>
                </div>
              )}
              {tab === 'external' && !isCrypto && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Bank</span>
                  <span className="font-bold text-ink-900">{bankName}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Back</Button>
              <Button onClick={handleProceedToPin}>Authorize PIN →</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── PIN Modal ── */}
      <PinAuthModal
        open={isPinOpen}
        onClose={() => setIsPinOpen(false)}
        onAuthorized={handlePinAuthorized}
        transferDetails={pinTransferDetails}
        loading={processing}
      />

      {/* ── QR Scanner ── */}
      <QrScannerModal
        open={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        onScanSuccess={(addr) => { setCryptoAddress(addr); setIsQrOpen(false) }}
      />

      {/* ── Receipt ── */}
      <ProfessionalReceiptModal
        open={Boolean(receipt)}
        onClose={() => setReceipt(null)}
        receipt={receipt}
        onDone={() => { setReceipt(null); navigate('/dashboard') }}
      />
    </DashboardLayout>
  )
}
