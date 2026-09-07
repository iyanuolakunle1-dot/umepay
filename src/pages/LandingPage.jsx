import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Lock,
  Menu,
  Phone,
  Send,
  ShieldCheck,
  Smile,
  Star,
  UserCheck,
  X,
} from 'lucide-react'
import CountryCodeDropdown from '../components/common/CountryCodeDropdown.jsx'
import LandingHeroDiagram from '../components/landing/LandingHeroDiagram.jsx'
import LandingVirtualCard from '../components/landing/LandingVirtualCard.jsx'

const navLinks = [
  { label: 'Multi-Asset Wallet', href: '#assets' },
  { label: 'Virtual Cards', href: '#card' },
  { label: 'Send/Receive', href: '#routing' },
  { label: 'Exchange', href: '#assets' },
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
    body: 'Direct local rails through FedNow and ACH clearance.',
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
    body: 'Multi-chain zero network fee routing on Tron and Ethereum.',
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
  { value: '$5.4B+', label: 'Volume Transacted', sub: 'Processed across global rails' },
  { value: '140+', label: 'Countries Active', sub: 'Supported for multi-asset conversion' },
  { value: '1.2M+', label: 'Verified Identities', sub: 'Connecting daily to global rails' },
  { value: '99.99%', label: 'Global Uptime', sub: 'Guaranteed network reliability' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  const [heroPhone, setHeroPhone] = useState('')
  const [ctaPhone, setCtaPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
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
    navigate('/onboarding', { state: { phone: heroPhone || '812 345 6789' } })
  }

  function handleCtaSubmit(e) {
    e?.preventDefault?.()
    navigate('/onboarding', { state: { phone: ctaPhone || '812 345 6789' } })
  }

  return (
    <div className="bg-white text-[#0F172A] font-sans antialiased selection:bg-amber-100 selection:text-amber-900 min-h-screen">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/90 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <span className="font-extrabold text-2xl sm:text-[26px] text-[#0F172A] tracking-tight font-sans">
              Umepay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((l) => (
              <button
                key={l.label}
                type="button"
                onClick={() => scrollToSection(l.href)}
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Clean Desktop Auth Links */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 px-4 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-[#18224b] hover:bg-[#0f172a] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Create Account</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white px-5 py-6 shadow-xl animate-fade-in">
            <div className="space-y-2 mb-6">
              {navLinks.map((l) => (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => scrollToSection(l.href)}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#18224b] text-white font-bold text-sm shadow-sm transition-all"
              >
                <span>Create Free Account</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Sign In
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
              One verified ID connecting fiat accounts, traditional banks, virtual cards, and crypto assets.
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

            {/* Feature Checkmarks */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Check size={14} strokeWidth={2.8} className="text-emerald-500" /> Bank-grade 256-bit
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} strokeWidth={2.8} className="text-emerald-500" /> Instant Verification
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} strokeWidth={2.8} className="text-emerald-500" /> Zero Monthly Fees
              </span>
            </div>
          </div>

          {/* Right Hero: Universal Routing Diagram */}
          <div className="relative flex items-center justify-center">
            <LandingHeroDiagram />
          </div>
        </div>
      </section>

      {/* 3. Section: How UMEPAY simplifies your finance */}
      <section id="routing" className="py-20 sm:py-24 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              How UMEPAY simplifies your finance
            </h2>
            <p className="mt-3 text-slate-500 text-sm sm:text-base leading-relaxed">
              Instant connectivity through a single ID and zero-code payments for your bank account and multi-rail settlements.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            {steps.map((s) => (
              <div key={s.n} className="relative bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-5">
                  <div className={`h-12 w-12 rounded-2xl ${s.iconBg} grid place-items-center shadow-xs group-hover:scale-110 transition-transform`}>
                    <s.icon size={22} />
                  </div>
                  <span className="text-2xl font-black text-slate-200 tracking-tighter">{s.n}</span>
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
                Stop juggling multiple addresses. UMEPAY dynamically manages currencies for your destination with zero slippage or hidden bank fees.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/convert')}
              className="self-start sm:self-auto rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Real-time live exchange rates</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {assets.map((a) => (
              <div
                key={a.code}
                className="rounded-2xl bg-white border border-slate-100 p-5 shadow-xs hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between group"
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
                  <h3 className="text-sm font-extrabold text-[#0F172A] mb-1.5 group-hover:text-blue-600 transition-colors">{a.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Section: Virtual Visa Card */}
      <section id="card" className="py-20 sm:py-28 bg-[#F3F6FC] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Card Visual Matching Screenshot 4 */}
          <div className="flex justify-center lg:justify-start">
            <LandingVirtualCard />
          </div>

          {/* Text & Feature List */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4 uppercase tracking-wider">
              VISA • VIRTUAL
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Spend anywhere, directly from your number
            </h2>

            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Issue your universal digital VISA in 30 seconds. Connect it directly to your unified phone balance and tap to pay anywhere Visa is accepted worldwide.
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                'Apple Pay & Google Pay compatible',
                'Direct crypto conversions at point of sale',
                'Zero foreign exchange mark-up fees',
                'Instant push notifications & software controls',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Built on trust, secured by design
            </h2>
            <p className="mt-3 text-slate-500 text-sm sm:text-base leading-relaxed">
              UMEPAY operates at the highest levels of global compliance and institutional security to ensure your funds and data remain protected.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trust.map((t) => (
              <div key={t.title} className="rounded-3xl border border-slate-100 p-6 shadow-xs bg-white hover:shadow-md transition-shadow">
                <div className={`h-11 w-11 rounded-2xl ${t.iconTone} grid place-items-center mb-4`}>
                  <t.icon size={22} />
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
            Create your universal financial identity today. Instantly connect your phone number and receive your free virtual Visa card in seconds.
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
            No credit card required. Free account setup with instant verification in eligible countries.
          </p>
        </div>
      </section>

      {/* 9. Footer */}
      <footer id="developers" className="bg-[#0B1120] text-slate-400 text-xs py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-extrabold text-lg text-white tracking-tight font-sans">UMEPAY</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The universal identity layer for world-class fiat accounts, stablecoins, and cards on demand.
              </p>
            </div>

            {[
              {
                title: 'PRODUCT',
                items: ['Multi-Asset Wallet', 'Universal ID Card', 'Virtual Visa Card', 'Instant Swap'],
              },
              {
                title: 'COMPANY',
                items: ['About Us', 'Careers', 'Press Kit', 'Contact'],
              },
              {
                title: 'DEVELOPERS',
                items: ['API Reference', 'SDK Libraries', 'Webhooks', 'Sandbox Access'],
              },
              {
                title: 'REGULATION & LEGAL',
                items: ['Privacy Policy', 'Terms of Service', 'AML/KYC Policy', 'Licenses & Security'],
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
              © 2026 UMEPAY Inc. All rights reserved. Licensed as a Money Services Business (MSB) under FinCEN regulation.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">𝕏</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
