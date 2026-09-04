import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageSquare, Search, Sparkles } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

const faqs = [
  {
    q: 'How do I upgrade my KYC limit to Tier 2 or Tier 3?',
    category: 'KYC & Limits',
    a: 'You can complete our instant 3-step KYC verification by submitting a valid government ID (Passport, National ID, Driver’s License) and completing live selfie biometric verification. Upon approval, your daily send limit immediately increases to $50,000.00 with unlimited incoming transfers.',
  },
  {
    q: 'How does multi-currency routing via Universal Financial ID work?',
    category: 'Send & Receive',
    a: 'Your verified phone number acts as your unified universal routing address. Counterparties can send USD, NGN, GBP, EUR, or stablecoins (USDT/USDC) directly using your phone number without requiring complicated IBANs or 42-character crypto addresses.',
  },
  {
    q: 'What fees are charged for deposits, conversions, and transfers?',
    category: 'Fees & Rates',
    a: 'Internal transfers between verified Umepay accounts are 100% free with instant atomic settlement. Fiat exchange rates are transparently quoted at real-time interbank midpoint rates with 0% hidden markups.',
  },
  {
    q: 'How do I generate, scan, or download my QR Code?',
    category: 'Send & Receive',
    a: 'Navigate to the "Receive" screen or tap "View Account Details" in your dashboard to generate your high-resolution vector QR Code. You can download the PNG or share your instant payment link with counterparties.',
  },
  {
    q: 'How does the Virtual Visa card work with Apple Pay and Google Pay?',
    category: 'Virtual Cards',
    a: 'Your virtual card is linked directly to your multi-currency cash balance. You can add it to Apple Wallet or Google Wallet with 1-tap in the Wallets tab and spend globally anywhere Visa is accepted.',
  },
]

const categories = ['All', 'KYC & Limits', 'Send & Receive', 'Fees & Rates', 'Virtual Cards']

export default function HelpCenterModal({ open, onClose, onOpenSupport }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedIndex, setExpandedIndex] = useState(0)

  if (!open) return null

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch =
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Help Center & Knowledge Base" onClose={onClose} />
      <div className="p-6 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs, guides, and how-tos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl bg-slate-50 border border-slate-200 focus:border-ink-500 focus:bg-white pl-10 pr-4 text-sm outline-none transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-ink-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = expandedIndex === idx
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all ${
                    isOpen ? 'border-ink-200 bg-slate-50/70 shadow-xs' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left font-semibold text-sm text-ink-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={17}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-ink-900' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No matching help articles found. Try another search query.
            </div>
          )}
        </div>

        {/* Support CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-ink-900 to-ink-800 text-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-gold-400 shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">Still need personalized assistance?</p>
              <p className="text-xs text-white/70">Our priority customer team is online 24/7.</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            icon={MessageSquare}
            onClick={() => {
              onClose()
              onOpenSupport?.()
            }}
            className="shrink-0 w-full sm:w-auto"
          >
            Chat with Support
          </Button>
        </div>
      </div>
    </Modal>
  )
}
