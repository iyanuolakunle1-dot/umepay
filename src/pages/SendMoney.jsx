import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  Globe2,
  Lock,
  Phone,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
  Zap,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Card, { CardHeader } from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Badge from '../components/ui/Badge.jsx'
import Modal, { ModalHeader } from '../components/ui/Modal.jsx'
import CountryCodeDropdown from '../components/common/CountryCodeDropdown.jsx'
import ContactCard from '../components/send/ContactCard.jsx'
import QrScannerModal from '../components/send/QrScannerModal.jsx'
import PinAuthModal from '../components/send/PinAuthModal.jsx'
import ProfessionalReceiptModal from '../components/send/ProfessionalReceiptModal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const CHANNELS = [
  {
    id: 'phone',
    label: 'Phone / Universal ID',
    sub: 'Instant Zero-Fee P2P',
    icon: Phone,
    badge: 'Instant',
  },
  {
    id: 'bank',
    label: 'Bank Account Rail',
    sub: 'ACH, Wire, SEPA, NIBSS',
    icon: Building2,
    badge: 'Direct Wire',
  },
  {
    id: 'crypto',
    label: 'Crypto / Multi-Chain',
    sub: 'USDT, USDC, BTC, ETH',
    icon: Wallet,
    badge: 'On-Chain',
  },
]

const POPULAR_BANKS = [
  { name: 'Chase Bank (JPMorgan)', code: 'CHASE', country: '🇺🇸 US' },
  { name: 'Standard Chartered', code: 'SCB', country: '🇬🇧 Global' },
  { name: 'Barclays Bank', code: 'BARC', country: '🇬🇧 UK' },
  { name: 'Revolut Bank', code: 'REV', country: '🇪🇺 EU' },
  { name: 'Access Bank', code: 'ACC', country: '🇳🇬 NG' },
  { name: 'Wema Bank / ALAT', code: 'WEMA', country: '🇳🇬 NG' },
  { name: 'Zenith Bank', code: 'ZEN', country: '🇳🇬 NG' },
  { name: 'Kuda Microfinance Bank', code: 'KUDA', country: '🇳🇬 NG' },
]

const QUICK_AMOUNTS = [25, 50, 100, 250, 500, 1000]

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
  const toast = useToast()
  const navigate = useNavigate()

  // Primary Transfer Mode: 'phone' | 'bank' | 'crypto'
  const [channel, setChannel] = useState('phone')

  // --- Phone / Universal ID State ---
  const [countryCode, setCountryCode] = useState('+234')
  const [phoneRecipient, setPhoneRecipient] = useState('809 123 4567')
  const [phoneRecipientName, setPhoneRecipientName] = useState('Chioma Eze')
  const [searchContactQuery, setSearchContactQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState(recentContacts[0])

  // --- Bank Account Rail State ---
  const [bankName, setBankName] = useState('Chase Bank (JPMorgan)')
  const [accountNumber, setAccountNumber] = useState('021000021')
  const [accountName, setAccountName] = useState('Alexander Cooper')
  const [routingNumber, setRoutingNumber] = useState('021000021')

  // --- Crypto / Multi-Chain State ---
  const [cryptoAsset, setCryptoAsset] = useState(digitalAssets[0]) // USDT
  const [cryptoAddress, setCryptoAddress] = useState('')
  const [network, setNetwork] = useState('Tron (TRC-20)')
  const [cryptoAmount, setCryptoAmount] = useState('150.00')

  // --- Common Transfer Fields ---
  const [amount, setAmount] = useState('150.00')
  const [currency, setCurrency] = useState('USD')
  const [remark, setRemark] = useState('Project milestone settlement')

  // --- Modals State ---
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [receipt, setReceipt] = useState(null)

  const activeAccount = fiatAccounts.find((a) => a.code === currency) || fiatAccounts[0]

  const filteredContacts = useMemo(() => {
    if (!searchContactQuery) return myContacts
    return myContacts.filter((c) =>
      `${c.name} ${c.phone}`.toLowerCase().includes(searchContactQuery.toLowerCase())
    )
  }, [myContacts, searchContactQuery])

  function handleContactSelect(c) {
    setSelectedContact(c)
    setPhoneRecipient(c.phone.replace(/\D/g, '').slice(-10))
    setPhoneRecipientName(c.name)
    toast.info('Recipient Selected', `${c.name} (${c.phone}) selected.`)
  }

  function handleQrScanSuccess(scannedAddress, payeeName) {
    if (channel === 'crypto') {
      setCryptoAddress(scannedAddress)
    } else {
      setPhoneRecipient(scannedAddress)
      if (payeeName) setPhoneRecipientName(payeeName)
    }
  }

  function handleOpenReview(e) {
    e?.preventDefault?.()
    if (channel === 'phone' && !phoneRecipient) {
      toast.error('Missing Recipient', 'Please enter a recipient phone number.')
      return
    }
    if (channel === 'bank' && (!accountNumber || !accountName)) {
      toast.error('Missing Bank Details', 'Please complete the bank account information.')
      return
    }
    if (channel === 'crypto' && (!cryptoAddress || !cryptoAmount)) {
      toast.error('Missing Crypto Address', 'Please provide destination wallet address & amount.')
      return
    }
    setIsReviewOpen(true)
  }

  function handleProceedToPinAuth() {
    setIsReviewOpen(false)
    setIsPinModalOpen(true)
  }

  function handlePinAuthorized(code) {
    setIsPinModalOpen(false)
    setProcessing(true)

    setTimeout(() => {
      setProcessing(false)
      if (channel === 'phone') {
        const r = sendToContact({
          recipient: { name: phoneRecipientName || 'Payee', phone: `${countryCode} ${phoneRecipient}` },
          amount: parseFloat(amount),
          currency,
          remark,
        })
        setReceipt({
          ...r,
          rail: 'UMEPAY Instant Universal Rail',
          recipient: `${phoneRecipientName || 'Payee'} (${countryCode} ${phoneRecipient})`,
        })
      } else if (channel === 'bank') {
        const r = sendToContact({
          recipient: { name: accountName, phone: `${bankName} • ${accountNumber}` },
          amount: parseFloat(amount),
          currency,
          remark,
        })
        setReceipt({
          ...r,
          rail: `Direct Bank Wire (${bankName})`,
          recipient: `${accountName} (${bankName} - ${accountNumber.slice(-4)})`,
        })
      } else {
        const r = sendToExternalWallet({
          asset: cryptoAsset.code,
          address: cryptoAddress,
          network,
          amount: parseFloat(cryptoAmount),
          remark,
        })
        setReceipt({
          ...r,
          rail: `${network} Blockchain`,
          recipient: `${cryptoAddress.slice(0, 10)}...${cryptoAddress.slice(-6)}`,
          amount: cryptoAmount,
          currency: cryptoAsset.code,
        })
      }
      toast.success('Transfer Dispatched!', 'Funds have been atomically settled.')
    }, 900)
  }

  return (
    <DashboardLayout title="Send">
      {/* 1. Header Channel Selector */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-black text-ink-900 tracking-tight">Send Payment</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant multi-rail settlement across phone IDs, global bank accounts, and crypto addresses.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsQrScannerOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-ink-800 text-xs font-bold text-ink-900 shadow-xs transition-colors cursor-pointer"
          >
            <QrCode size={15} className="text-[#18224b]" />
            <span>Scan QR Code</span>
          </button>
        </div>

        {/* Channels Segmented Pill Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/60">
          {CHANNELS.map((c) => {
            const Icon = c.icon
            const active = channel === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setChannel(c.id)}
                className={`p-3.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-3 relative ${
                  active
                    ? 'bg-white text-ink-900 shadow-md ring-1 ring-slate-900/5'
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 transition-colors ${
                    active ? 'bg-[#18224b] text-white shadow-sm' : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  <Icon size={18} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-extrabold truncate">{c.label}</p>
                    <Badge variant={active ? 'primary' : 'neutral'} size="sm">
                      {c.badge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.sub}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Main Transfer Form & Side Breakdown */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
        {/* Left Card: Form */}
        <div className="space-y-6">
          {channel === 'phone' && (
            <Card>
              <CardHeader
                title="Recipient Universal ID"
                action={
                  <Badge variant="success" size="sm">
                    <ShieldCheck size={12} className="mr-1 inline" /> Verified Universal Directory
                  </Badge>
                }
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100 transition-colors">
                    <CountryCodeDropdown
                      value={countryCode}
                      onChange={(val) => setCountryCode(val)}
                    />
                    <span className="h-5 w-px bg-slate-200" />
                    <input
                      type="tel"
                      value={phoneRecipient}
                      onChange={(e) => {
                        setPhoneRecipient(e.target.value)
                        setPhoneRecipientName('Verified Payee')
                      }}
                      placeholder="809 123 4567"
                      className="w-full bg-transparent text-sm font-bold text-ink-900 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Recipient verified tag */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">{phoneRecipientName || selectedContact?.name}</span>
                      <span className="text-emerald-700 ml-1">({countryCode} {phoneRecipient})</span>
                    </div>
                  </div>
                  <span className="font-bold text-[10px] uppercase bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-full">
                    Active ID
                  </span>
                </div>

                {/* Recent Contacts Grid */}
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Recent Verified Contacts
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {recentContacts.map((c) => (
                      <ContactCard
                        key={c.id}
                        contact={c}
                        selected={selectedContact?.id === c.id}
                        onClick={handleContactSelect}
                      />
                    ))}
                  </div>
                </div>

                {/* Search Contacts Directory */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Directory Contacts
                    </p>
                    <span className="text-[11px] text-slate-400">{filteredContacts.length} contacts</span>
                  </div>
                  <Input
                    icon={Search}
                    placeholder="Filter saved beneficiaries by name or phone..."
                    value={searchContactQuery}
                    onChange={(e) => setSearchContactQuery(e.target.value)}
                  />
                  <div className="mt-2 max-h-48 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/40">
                    {filteredContacts.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleContactSelect(c)}
                        className="w-full flex items-center justify-between p-2.5 text-left hover:bg-slate-100/80 transition-colors cursor-pointer text-xs"
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
                        <ChevronRight size={14} className="text-slate-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {channel === 'bank' && (
            <Card>
              <CardHeader
                title="Direct Bank Rail Details"
                action={
                  <Badge variant="primary" size="sm">
                    Direct Wire Clearance
                  </Badge>
                }
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Select Destination Financial Institution
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm font-bold text-ink-900 bg-white outline-none focus:border-ink-800 focus:ring-2 focus:ring-ink-100"
                  >
                    {POPULAR_BANKS.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} ({b.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Account / IBAN Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="0123456789"
                      className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm font-bold text-ink-900 outline-none focus:border-ink-800 focus:ring-2 focus:ring-ink-100 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Routing Number / SWIFT
                    </label>
                    <input
                      type="text"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder="021000021"
                      className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm font-bold text-ink-900 outline-none focus:border-ink-800 focus:ring-2 focus:ring-ink-100 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Account Beneficiary Name
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. Alexander Cooper"
                    className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm font-bold text-ink-900 outline-none focus:border-ink-800 focus:ring-2 focus:ring-ink-100"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900">
                  <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                  <span>Account name validated via Interswitch &amp; FedNow routing validation.</span>
                </div>
              </div>
            </Card>
          )}

          {channel === 'crypto' && (
            <Card>
              <CardHeader
                title="Blockchain &amp; Smart Contract Destination"
                action={
                  <button
                    type="button"
                    onClick={() => setIsQrScannerOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-ink-800 hover:text-black cursor-pointer"
                  >
                    <QrCode size={14} /> Scan Address
                  </button>
                }
              />

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Select Crypto Asset
                    </label>
                    <select
                      value={cryptoAsset.code}
                      onChange={(e) =>
                        setCryptoAsset(digitalAssets.find((a) => a.code === e.target.value))
                      }
                      className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm font-bold text-ink-900 bg-white outline-none focus:border-ink-800"
                    >
                      {digitalAssets.map((a) => (
                        <option key={a.code} value={a.code}>
                          {a.code} — {a.name} ({a.balance} Available)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Network Rail
                    </label>
                    <select
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                      className="w-full h-12 rounded-xl border border-slate-200 px-3 text-sm font-bold text-ink-900 bg-white outline-none focus:border-ink-800"
                    >
                      <option>Tron (TRC-20)</option>
                      <option>Ethereum (ERC-20)</option>
                      <option>Bitcoin SegWit Mainnet</option>
                      <option>Solana Network</option>
                      <option>Polygon POS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Recipient Wallet Address / ENS
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cryptoAddress}
                      onChange={(e) => setCryptoAddress(e.target.value)}
                      placeholder="0x71C8657daB7926862a610e4b854378A8696F1F9e or satoshi.eth"
                      className="w-full h-12 rounded-xl border border-slate-200 pl-3 pr-10 text-xs font-mono font-bold text-ink-900 outline-none focus:border-ink-800"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIsQrScannerOpen(true)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-ink-900 cursor-pointer"
                    >
                      <QrCode size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Always confirm the selected transfer network (<span className="font-bold">{network}</span>) matches the recipient wallet format. Cross-chain transfers cannot be reversed.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Amount & Remark Section */}
          <Card>
            <CardHeader
              title="Transfer Amount &amp; Currency"
              action={
                <span className="text-xs text-slate-400">
                  Available: <span className="font-bold text-ink-900">{activeAccount.symbol}{activeAccount.balance.toLocaleString()} {activeAccount.code}</span>
                </span>
              }
            />

            <div className="space-y-4">
              {channel === 'crypto' ? (
                <div>
                  <div className="flex items-center rounded-2xl border border-slate-200 px-4 h-16 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100">
                    <input
                      type="number"
                      value={cryptoAmount}
                      onChange={(e) => setCryptoAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 min-w-0 text-3xl font-black text-ink-900 outline-none"
                    />
                    <span className="text-sm font-extrabold text-ink-800 px-3 py-1 bg-slate-100 rounded-xl">
                      {cryptoAsset.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Estimated Value: ~${(parseFloat(cryptoAmount || 0) * (cryptoAsset.usdEquivalent / cryptoAsset.balance || 1)).toFixed(2)} USD
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center rounded-2xl border border-slate-200 px-4 h-16 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100">
                    <span className="text-2xl font-bold text-slate-400 mr-2">{activeAccount.symbol}</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 min-w-0 text-3xl font-black text-ink-900 outline-none"
                    />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="text-sm font-extrabold text-ink-900 bg-slate-100 rounded-xl px-3 py-2 outline-none cursor-pointer"
                    >
                      {fiatAccounts.map((a) => (
                        <option key={a.code} value={a.code}>
                          {a.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      if (channel === 'crypto') setCryptoAmount(String(amt))
                      else setAmount(String(amt))
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    +${amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    if (channel === 'crypto') setCryptoAmount(String(cryptoAsset.balance))
                    else setAmount(String(activeAccount.balance))
                  }}
                  className="px-3 py-1.5 rounded-xl bg-ink-900 text-white text-xs font-extrabold hover:bg-ink-800 transition-colors cursor-pointer"
                >
                  USE MAX
                </button>
              </div>

              {/* Purpose / Remark */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Payment Purpose / Reference Note
                </label>
                <input
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="e.g. Invoice settlement, family support, contractor payout"
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-ink-900 outline-none focus:border-ink-800"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Transaction Summary & Authorization */}
        <div className="space-y-5 sticky top-24">
          <Card className="shadow-lg border-slate-200/80">
            <CardHeader
              title="Settlement Summary"
              action={
                <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Sparkles size={12} /> Instant Rail
                </span>
              }
            />

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Transfer Channel</span>
                <span className="font-bold text-ink-900">
                  {channel === 'phone' ? 'Universal Phone ID' : channel === 'bank' ? 'Direct Bank Wire' : 'Multi-Chain Crypto'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Destination</span>
                <span className="font-bold text-ink-900 truncate max-w-[180px]">
                  {channel === 'phone'
                    ? `${phoneRecipientName} (${countryCode} ${phoneRecipient})`
                    : channel === 'bank'
                    ? `${accountName} (${bankName})`
                    : `${cryptoAddress.slice(0, 10)}...`}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Debit Amount</span>
                <span className="font-black text-ink-900 text-sm">
                  {channel === 'crypto' ? `${cryptoAmount} ${cryptoAsset.code}` : `${activeAccount.symbol}${parseFloat(amount || 0).toLocaleString()} ${currency}`}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Network &amp; Platform Fee</span>
                <span className="font-bold text-emerald-600">$0.00 (Zero Fee Rail)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Expected Clearance</span>
                <span className="font-bold text-ink-900">~1.2 Seconds (Real-Time)</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">AML &amp; Fraud Clearance</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck size={13} /> Passed
                </span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              className="mt-6 shadow-md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleOpenReview}
            >
              Review &amp; Authorize Transfer
            </Button>
          </Card>

          {/* Security Compliance Guarantee */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 space-y-2">
            <div className="flex items-center gap-2 text-ink-900 font-bold">
              <Lock size={14} className="text-[#18224b]" />
              <span>Multi-Signature Ledger Protection</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every outbound transaction requires 4-digit PIN / biometric authorization and is broadcast via encrypted liquidity pools.
            </p>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal open={isReviewOpen} onClose={() => setIsReviewOpen(false)} size="sm">
        <ModalHeader title="Confirm Transfer Details" onClose={() => setIsReviewOpen(false)} />
        <div className="p-6 pt-3 space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Recipient</span>
              <span className="font-bold text-ink-900">
                {channel === 'phone' ? phoneRecipientName : channel === 'bank' ? accountName : cryptoAddress.slice(0, 14)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Amount</span>
              <span className="font-extrabold text-ink-900 text-sm">
                {channel === 'crypto' ? `${cryptoAmount} ${cryptoAsset.code}` : `$${amount} ${currency}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transfer Speed</span>
              <span className="font-bold text-emerald-600">Atomic Real-Time</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
              Back
            </Button>
            <Button onClick={handleProceedToPinAuth}>
              Authorize PIN →
            </Button>
          </div>
        </div>
      </Modal>

      {/* PIN Security Modal */}
      <PinAuthModal
        open={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onAuthorized={handlePinAuthorized}
        transferDetails={{
          amountFormatted: channel === 'crypto' ? `${cryptoAmount} ${cryptoAsset.code}` : `${activeAccount.symbol}${amount} ${currency}`,
          recipientName: channel === 'phone' ? phoneRecipientName : channel === 'bank' ? accountName : 'Crypto Recipient',
        }}
        loading={processing}
      />

      {/* QR Scanner Modal */}
      <QrScannerModal
        open={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScanSuccess={handleQrScanSuccess}
      />

      {/* Official Receipt Modal */}
      <ProfessionalReceiptModal
        open={Boolean(receipt)}
        onClose={() => setReceipt(null)}
        receipt={receipt}
        onDone={() => {
          setReceipt(null)
          navigate('/dashboard')
        }}
      />
    </DashboardLayout>
  )
}
