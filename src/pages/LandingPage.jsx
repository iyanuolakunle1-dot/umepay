import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Globe2,
  Lock,
  Menu,
  Phone,
  Send,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  UserCheck,
  Wallet,
  X,
} from 'lucide-react'
import Modal, { ModalHeader } from '../components/ui/Modal.jsx'
import Button from '../components/ui/Button.jsx'
import CountryCodeDropdown from '../components/common/CountryCodeDropdown.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const navLinks = [
  { label: 'Universal Routing', href: '#routing' },
  { label: 'Assets', href: '#assets' },
  { label: 'Virtual Card', href: '#card' },
  { label: 'Security', href: '#security' },
  { label: 'Developers', href: '#developers' },
]

const steps = [
  {
    n: '01',
    icon: Phone,
    iconBg: 'bg-indigo-50 text-indigo-600',
    title: 'Register Phone',
    body: 'Input your active phone number and verify with an instant OTP for identity binding.',
  },
  {
    n: '02',
    icon: ShieldCheck,
    iconBg: 'bg-amber-50 text-amber-500',
    title: 'Verify Identity',
    body: 'Instant KYC verification with state-level security to bind your real financial credentials.',
  },
  {
    n: '03',
    icon: UserCheck,
    iconBg: 'bg-blue-50 text-blue-600',
    title: 'Get Universal ID',
    body: 'Receive your universal financial routing mapping for fiat rails, USD, and virtual crypto addresses automatically.',
  },
  {
    n: '04',
    icon: Send,
    iconBg: 'bg-amber-50 text-amber-600',
    title: 'Send & Receive',
    body: 'Send global transactions instantly to any destination by simply knowing your partner’s phone number.',
  },
]

const assets = [
  {
    badge: 'Fiat Account',
    code: 'USD',
    codeTone: 'text-amber-600 bg-amber-50 border-amber-200',
    name: 'United States Dollar',
    body: 'Direct local rails through Silvergate & FedNow.',
  },
  {
    badge: 'Fiat Account',
    code: 'EUR',
    codeTone: 'text-amber-600 bg-amber-50 border-amber-200',
    name: 'Euro Union',
    body: 'Instant settlements through SEPA network in real-time.',
  },
  {
    badge: 'Fiat Account',
    code: 'NGN',
    codeTone: 'text-amber-600 bg-amber-50 border-amber-200',
    name: 'Nigerian Naira',
    body: 'Instant local payouts with direct clearance via NIBSS.',
  },
  {
    badge: 'Fiat Account',
    code: 'GBP',
    codeTone: 'text-amber-600 bg-amber-50 border-amber-200',
    name: 'British Pound',
    body: 'Faster Payments settlement for instant GBP movement.',
  },
  {
    badge: 'Stablecoin',
    code: 'USDT',
    codeTone: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    name: 'Tether USD',
    body: 'Zero network fee multi-chain routing on Tron and Ethereum.',
  },
  {
    badge: 'Stablecoin',
    code: 'USDC',
    codeTone: 'text-purple-600 bg-purple-50 border-purple-200',
    name: 'USD Coin',
    body: 'Fully backed regulated stablecoin for global settlements.',
  },
  {
    badge: 'Crypto Asset',
    code: 'BTC',
    codeTone: 'text-amber-600 bg-amber-50 border-amber-200',
    name: 'Bitcoin',
    body: 'Instant conversions with deep institutional liquidity pool.',
  },
  {
    badge: 'Crypto Asset',
    code: 'ETH',
    codeTone: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    name: 'Ethereum',
    body: 'Multi-asset smart contract collateral for card spending.',
  },
]

const trust = [
  {
    icon: Smile,
    iconTone: 'bg-blue-50 text-blue-600',
    title: 'Privacy-Preserving ID',
    body: 'Cross-platform data isolation and zero-knowledge proofs, hiding your true phone details for routing or incoming/outgoing queries.',
  },
  {
    icon: CheckCircle2,
    iconTone: 'bg-amber-50 text-amber-500',
    title: 'State-Grade KYC',
    body: 'Automated binding with national records to ensure every phone identity maps strictly to its verified global counterpart.',
  },
  {
    icon: Lock,
    iconTone: 'bg-purple-50 text-purple-600',
    title: 'End-to-End Encryption',
    body: 'Every transaction is securely signed via multi-party computation and cold-storage vault clearance.',
  },
  {
    icon: Star,
    iconTone: 'bg-amber-50 text-amber-500',
    title: 'Regulatory Compliance',
    body: 'Fully compliant with global FinCEN MSB, FCA e-money directives, and local banking guidelines.',
  },
]

const stats = [
  { value: '$5.4B+', label: 'Volume Transacted', sub: 'Processed across 4 continents' },
  { value: '140+', label: 'Countries Active', sub: 'Supported for multi-asset conversion' },
  { value: '1.2M+', label: 'Verified Identities', sub: 'Connecting daily to global rails' },
  { value: '99.99%', label: 'System SLA', sub: 'Uptime guaranteed across global settlement' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useApp()

  const [heroPhone, setHeroPhone] = useState('')
  const [ctaPhone, setCtaPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [signInPhone, setSignInPhone] = useState('812 345 6789')
  const [signingIn, setSigningIn] = useState(false)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function scrollToSection(href) {
    setIsMobileMenuOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  function handleHeroSubmit(e) {
    e?.preventDefault?.()
    navigate('/register', { state: { phone: heroPhone || '812 345 6789' } })
  }

  function handleCtaSubmit(e) {
    e?.preventDefault?.()
    navigate('/register', { state: { phone: ctaPhone || '812 345 6789' } })
  }

  function handleSignInSubmit(e) {
    e?.preventDefault?.()
    setSigningIn(true)
    setTimeout(() => {
      setSigningIn(false)
      setIsSignInOpen(false)
      navigate('/onboarding/verify', { state: { phone: signInPhone, mode: 'signin' } })
    }, 400)
  }

  function handleQuickLogin() {
    setSigningIn(true)
    setTimeout(() => {
      setSigningIn(false)
      setIsSignInOpen(false)
      toast.success('Signed In Successfully', `Welcome back, ${user.name}!`)
      navigate('/dashboard')
    }, 500)
  }

  return (
    <div className="bg-white text-[#0F172A] font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-br from-[#18224b] to-[#0f172a] text-white font-black text-sm grid place-items-center shadow-md group-hover:scale-105 transition-transform">
              U
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight">Umepay</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((l) => (
              <button
                key={l.label}
                type="button"
                onClick={() => scrollToSection(l.href)}
                className="px-3.5 py-1.5 rounded-xl text-[13px] font-semibold text-slate-600 hover:text-ink-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right CTA Hub */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-bold text-slate-700 hover:text-ink-900 px-3.5 py-2 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-[#2b59ff] hover:bg-[#1f48e6] text-white text-xs sm:text-sm font-bold px-4.5 py-2 rounded-full shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-ink-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white/98 backdrop-blur-lg px-5 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5 mb-6">
              {navLinks.map((l) => (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => scrollToSection(l.href)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-ink-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2b59ff] hover:bg-[#1f48e6] text-white font-bold text-sm shadow-sm transition-all"
              >
                <span>Create Free Account</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#0F172A] leading-[1.08]">
              Your phone number is <br />
              your <span className="text-[#F59E0B]">financial identity.</span>
            </h1>

            <p className="mt-5 text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
              One verified ID connecting fiat accounts, stablecoins, blockchain wallets, and virtual cards.
              No long wallet addresses or complicated routing codes.
            </p>

            {/* Pill Phone Input Box */}
            <form
              onSubmit={handleHeroSubmit}
              className="mt-8 flex items-center bg-white border border-slate-200 rounded-full p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-w-md focus-within:border-[#18224b] focus-within:ring-2 focus-within:ring-[#18224b]/10 transition-all"
            >
              <div className="border-r border-slate-200 pr-1 shrink-0">
                <CountryCodeDropdown
                  value={countryCode}
                  onChange={(val) => setCountryCode(val)}
                />
              </div>

              <input
                type="tel"
                value={heroPhone}
                onChange={(e) => setHeroPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
              />

              <button
                type="submit"
                className="bg-[#18224b] hover:bg-[#0f172a] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Feature Checkmarks Under Input */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Check size={14} strokeWidth={2.8} className="text-emerald-500" /> Auto-routing to fiat
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} strokeWidth={2.8} className="text-emerald-500" /> Instant Verification
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} strokeWidth={2.8} className="text-emerald-500" /> Zero Crypto Gas Fees
              </span>
            </div>
          </div>

          {/* Right Hero Hub Diagram Graphic */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-100 p-8 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
              {/* Background ambient radial circles */}
              <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

              <div className="relative h-72 sm:h-80 flex items-center justify-center">
                {/* SVG Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-200 stroke-1 stroke-dashed">
                  <line x1="20%" y1="20%" x2="50%" y2="50%" />
                  <line x1="80%" y1="20%" x2="50%" y2="50%" />
                  <line x1="20%" y1="80%" x2="50%" y2="50%" />
                  <line x1="80%" y1="80%" x2="50%" y2="50%" />
                </svg>

                {/* Center Universal ID Circle */}
                <div className="z-10 h-32 w-32 rounded-full bg-[#F59E0B] p-2 text-white text-center flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(245,158,11,0.35)] ring-8 ring-[#F59E0B]/15">
                  <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                    <Check size={16} strokeWidth={3} className="text-white" />
                  </div>
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-white/90">Universal ID</p>
                  <p className="text-xs font-extrabold mt-0.5 tracking-tight">+1 (555) 019-2834</p>
                </div>

                {/* Node 1: Top Left - Fiat Accounts */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-2.5 bg-white/90 backdrop-blur rounded-2xl p-2.5 border border-slate-100 shadow-sm">
                  <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 grid place-items-center shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div className="text-left pr-1">
                    <p className="text-xs font-bold text-slate-900 leading-tight">Fiat Accounts</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">USD, EUR, NGN</p>
                  </div>
                </div>

                {/* Node 2: Top Right - Stablecoins */}
                <div className="absolute top-2 right-2 z-10 flex items-center gap-2.5 bg-white/90 backdrop-blur rounded-2xl p-2.5 border border-slate-100 shadow-sm">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="text-left pr-1">
                    <p className="text-xs font-bold text-slate-900 leading-tight">Stablecoins</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">USDT, USDC</p>
                  </div>
                </div>

                {/* Node 3: Bottom Left - Virtual Visa */}
                <div className="absolute bottom-2 left-2 z-10 flex items-center gap-2.5 bg-white/90 backdrop-blur rounded-2xl p-2.5 border border-slate-100 shadow-sm">
                  <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 grid place-items-center shrink-0">
                    <CreditCard size={16} />
                  </div>
                  <div className="text-left pr-1">
                    <p className="text-xs font-bold text-slate-900 leading-tight">Virtual Visa</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">Apple &amp; Google Pay</p>
                  </div>
                </div>

                {/* Node 4: Bottom Right - Crypto Assets */}
                <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2.5 bg-white/90 backdrop-blur rounded-2xl p-2.5 border border-slate-100 shadow-sm">
                  <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 grid place-items-center shrink-0">
                    <Wallet size={16} />
                  </div>
                  <div className="text-left pr-1">
                    <p className="text-xs font-bold text-slate-900 leading-tight">Crypto Assets</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">BTC, ETH</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: How UMEPAY simplifies your finance */}
      <section id="routing" className="py-20 sm:py-24 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            How UMEPAY simplifies your finance
          </h2>
          <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Instant connectivity through a single API and zero-code payments for your bank account and multi-rail settlements.
          </p>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left relative">
            {steps.map((s) => (
              <div key={s.n} className="relative group">
                <div className="flex items-center justify-between mb-5">
                  <div className={`h-11 w-11 rounded-2xl ${s.iconBg} grid place-items-center shadow-xs`}>
                    <s.icon size={20} />
                  </div>
                  <span className="text-2xl font-black text-slate-200 tracking-tighter">
                    {s.n}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0F172A] mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section: One identity, every asset */}
      <section id="assets" className="py-20 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                One identity, every asset
              </h2>
              <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl leading-relaxed">
                Stop juggling multiple apps and wallet formats. Connect your assets to your phone identity &amp; start using them with moving a single swipe.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/wallets')}
              className="self-start sm:self-auto rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-colors cursor-pointer"
            >
              Explore supported assets
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {assets.map((a) => (
              <div
                key={a.code}
                className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {a.badge}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${a.codeTone}`}>
                      {a.code}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#0F172A] mb-1.5">{a.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Section: Virtual & Physical Visa Card */}
      <section id="card" className="py-20 sm:py-24 bg-[#EEF4FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Card Mockup Graphic */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md aspect-[1.586/1] rounded-3xl bg-gradient-to-br from-[#1b3bb6] via-[#16309e] to-[#0f2275] p-7 sm:p-8 text-white shadow-[0_20px_50px_rgba(27,59,182,0.3)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <span className="font-extrabold text-xl tracking-tight">Umepay</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  Physical &amp; Virtual
                </span>
              </div>

              <div className="relative z-10">
                <div className="h-8 w-11 rounded-md bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 shadow-inner flex items-center justify-center opacity-90 mb-4" />
                <p className="font-mono text-base sm:text-lg font-bold tracking-[0.25em] text-white/95">
                  ••••  ••••  ••••  0852
                </p>
              </div>

              <div className="flex items-end justify-between text-xs relative z-10">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/60 mb-0.5">Cardholder</p>
                  <p className="font-bold tracking-wider text-xs">ALEXANDER COOPER</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider text-white/60 mb-0.5">Expires</p>
                  <p className="font-bold tracking-wider text-xs">08/29</p>
                </div>
                <div className="text-xl font-black italic tracking-tighter text-white">
                  VISA
                </div>
              </div>
            </div>
          </div>

          {/* Text & Feature List */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4">
              New • Physical &amp; Virtual Card
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Spend anywhere, directly from your number
            </h2>

            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Power your physical and digital VISA card instantly. Connect it directly to your unified phone balance and tap to pay anywhere Visa is accepted worldwide.
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                'Apple Pay & Google Pay compatible',
                'Direct real-time conversions at spot price',
                'Zero foreign exchange markup fees worldwide',
                'Instant push notifications & freeze controls',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <div className="h-5 w-5 rounded-full bg-blue-600 text-white grid place-items-center shrink-0 shadow-xs">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section: Built on trust, secured by design */}
      <section id="security" className="py-20 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Built on trust, secured by design
          </h2>
          <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            UMEPAY operates at the highest standard of global compliance and institutional security to ensure every transaction is protected.
          </p>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {trust.map((t) => (
              <div
                key={t.title}
                className="rounded-2xl border border-slate-100 p-6 shadow-xs bg-white hover:shadow-md transition-shadow"
              >
                <div className={`h-10 w-10 rounded-xl ${t.iconTone} grid place-items-center mb-5`}>
                  <t.icon size={20} />
                </div>
                <h3 className="text-sm font-extrabold text-[#0F172A] mb-2">{t.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Section: Stats Banner */}
      <section className="py-16 sm:py-20 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
                {s.value}
              </p>
              <p className="mt-2 text-xs sm:text-sm font-bold text-slate-900">{s.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Section: Bottom CTA */}
      <section className="py-20 sm:py-28 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Ready to simplify your global finances?
          </h2>
          <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
            Create your universal financial identity today. Instantly connect your phone number and receive your free virtual Visa debit card.
          </p>

          {/* Centered Pill Input Bar */}
          <form
            onSubmit={handleCtaSubmit}
            className="mt-8 mx-auto flex items-center bg-white border border-slate-200 rounded-full p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] max-w-md focus-within:border-[#18224b] focus-within:ring-2 focus-within:ring-[#18224b]/10 transition-all"
          >
            <div className="border-r border-slate-200 pr-1 shrink-0">
              <CountryCodeDropdown
                value={countryCode}
                onChange={(val) => setCountryCode(val)}
              />
            </div>

            <input
              type="tel"
              value={ctaPhone}
              onChange={(e) => setCtaPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
            />

            <button
              type="submit"
              className="bg-[#18224b] hover:bg-[#0f172a] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400">
            No credit check required. Available for individuals &amp; businesses in 140+ countries.
          </p>
        </div>
      </section>

      {/* 9. Footer */}
      <footer id="developers" className="bg-[#0B1120] text-slate-400 text-xs py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-lg bg-white/10 grid place-items-center text-white font-extrabold text-xs">
                  U
                </div>
                <span className="font-extrabold text-base text-white tracking-tight">UMEPAY</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The universal identity layer for world currencies, fiat accounts, stablecoins, and cards on demand.
              </p>
            </div>

            {[
              {
                title: 'PRODUCT',
                items: ['How It Works', 'Multi-Asset Grid', 'Virtual Visa Card', 'Fees & Limits'],
              },
              {
                title: 'COMPANY',
                items: ['About Us', 'Careers', 'Press Kit', 'Contact'],
              },
              {
                title: 'DEVELOPERS',
                items: ['API Reference', 'SDK Libraries', 'Webhooks', 'System Status'],
              },
              {
                title: 'REGULATORY & LEGAL',
                items: ['Privacy Policy', 'Terms of Service', 'KYC/AML Policy', 'Licenses & Custody'],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold text-xs tracking-wider mb-3.5">
                  {col.title}
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
                  {col.items.map((i) => (
                    <li key={i}>
                      <a href="#" className="hover:text-white transition-colors">
                        {i}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              © 2026 UMEPAY Inc. All rights reserved. Universal financial identity layer and partner settlement networks.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-white">𝕏</a>
              <a href="#" className="hover:text-white">GitHub</a>
              <a href="#" className="hover:text-white">Discord</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Sign In Modal */}
      <Modal open={isSignInOpen} onClose={() => setIsSignInOpen(false)} size="sm">
        <ModalHeader title="Sign In to UMEPAY" onClose={() => setIsSignInOpen(false)} />
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Enter your registered phone number or use Fast Sign In to access your verified dashboard.
          </p>

          <form onSubmit={handleSignInSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Phone Number
              </label>
              <div className="flex items-center h-11 rounded-xl border border-slate-200 px-3 gap-2 focus-within:border-[#18224b] focus-within:ring-2 focus-within:ring-[#18224b]/10">
                <span className="text-xs font-bold text-slate-700">🇳🇬 +234</span>
                <span className="h-4 w-px bg-slate-200" />
                <input
                  type="tel"
                  value={signInPhone}
                  onChange={(e) => setSignInPhone(e.target.value)}
                  placeholder="812 345 6789"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={signingIn}
              icon={ArrowRight}
              iconPosition="right"
            >
              Continue with OTP
            </Button>
          </form>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>⚡ Fast Sign In ({user.name})</span>
            </button>
          </div>

          <div className="text-center pt-1 space-y-1">
            <div>
              <Link
                to="/register"
                onClick={() => setIsSignInOpen(false)}
                className="text-xs font-semibold text-[#18224b] hover:underline cursor-pointer"
              >
                Don't have an account? Create one
              </Link>
            </div>
            <div>
              <Link
                to="/login"
                onClick={() => setIsSignInOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-ink-900 cursor-pointer"
              >
                Go to Full Log In Page →
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
