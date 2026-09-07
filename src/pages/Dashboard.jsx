import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Copy,
  CreditCard,
  MoreVertical,
  RefreshCw,
  Wallet,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Card, { CardHeader } from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import { SkeletonCard, SkeletonRow } from '../components/ui/Skeleton.jsx'
import ActivityRow from '../components/dashboard/ActivityRow.jsx'
import AllocationChart from '../components/dashboard/AllocationChart.jsx'
import AccountDetailModal from '../components/wallets/AccountDetailModal.jsx'
import UniversalAccountModal from '../components/dashboard/UniversalAccountModal.jsx'
import QuickSendModal from '../components/dashboard/QuickSendModal.jsx'
import QuickConvertModal from '../components/dashboard/QuickConvertModal.jsx'
import TransactionReceiptModal from '../components/dashboard/TransactionReceiptModal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { allocationSplit } from '../data/mockData.js'

export default function Dashboard() {
  const { user, fiatAccounts, digitalAssets, activity, totalPortfolioValue } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [universalModalOpen, setUniversalModalOpen] = useState(false)
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [convertModalOpen, setConvertModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const ngn = fiatAccounts.find((a) => a.code === 'NGN') || {
    name: 'NIGERIAN NAIRA',
    balance: 4250000,
    usdEquivalent: 2656.25,
    symbol: '₦',
    code: 'NGN',
  }
  const usd = fiatAccounts.find((a) => a.code === 'USD') || {
    name: 'US DOLLAR VAULT',
    balance: 2100.5,
    usdEquivalent: 2100.5,
    symbol: '$',
    code: 'USD',
    tag: 'FedWire Mapped',
  }
  const usdt = digitalAssets.find((a) => a.code === 'USDT') || {
    name: 'TETHER STABLECOIN',
    balance: 3200.0,
    usdEquivalent: 3200.0,
    code: 'USDT',
    network: 'ERC-20/Tron',
  }
  const btc = digitalAssets.find((a) => a.code === 'BTC') || {
    name: 'BITCOIN CORE',
    balance: 0.0045,
    usdEquivalent: 4493.57,
    code: 'BTC',
  }

  function copyUniversalId() {
    navigator.clipboard?.writeText(user.universalAccountNumber || '812 345 6789')
    toast.success('Universal account number copied', user.universalAccountNumber || '812 345 6789')
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Unverified KYC Banner */}
        {!user.kycVerified && (
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                <span className="font-extrabold text-sm">!</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">Identity Verification Required (Tier 1)</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Action Needed
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  You are currently on basic Tier 1 with a $500/day limit. Complete your KYC verification in under 2 minutes to unlock <strong>Virtual Visa Cards</strong>, increase your send limit to <strong>$50,000/day</strong>, and activate universal fiat/crypto vaults.
                </p>
              </div>
            </div>

            <Link
              to="/kyc"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
            >
              <span>Verify Identity</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* TOP SECTION: Blue Universal Card + 2x2 Quick Actions matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Universal Financial ID Card (Royal Blue) */}
          <div className="lg:col-span-8 rounded-3xl p-4 sm:p-7 text-white bg-gradient-to-tr from-[#0038E2] via-[#0052FF] to-[#0A65FF] shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">
                  UNIVERSAL FINANCIAL ID
                </span>
                {user.kycVerified ? (
                  <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-emerald-300 font-bold text-[10px] tracking-wider uppercase">
                    VERIFIED
                  </span>
                ) : (
                  <Link
                    to="/kyc"
                    className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-bold text-[10px] tracking-wider uppercase hover:bg-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>UNVERIFIED (TIER 1)</span>
                    <ArrowRight size={10} />
                  </Link>
                )}
              </div>

              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">
                UNIVERSAL ACCOUNT NUMBER
              </p>
              <div className="flex items-center gap-3">
                <span className="text-lg sm:text-3xl font-extrabold tracking-wider font-mono text-white break-all">
                  {user.universalAccountNumber || '812 345 6789'}
                </span>
                <button
                  type="button"
                  onClick={copyUniversalId}
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                  title="Copy account number"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/15 mt-4">
              <p className="text-[11px] font-medium text-white/80">
                Linked: Fiat ACH, Stablecoins (USDC/USDT), Apple Pay &amp; Visa Rail.
              </p>
            </div>
          </div>

          {/* 2x2 Quick Action Cards matching screenshot */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('/send')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <ArrowUpRight size={18} strokeWidth={2.4} />
              </div>
              <span className="text-xs font-bold text-slate-800">Send Money</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/receive')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <ArrowDownLeft size={18} strokeWidth={2.4} />
              </div>
              <span className="text-xs font-bold text-slate-800">Receive</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/convert')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <RefreshCw size={18} strokeWidth={2.4} />
              </div>
              <span className="text-xs font-bold text-slate-800">Convert</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/cards')}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <CreditCard size={18} strokeWidth={2.4} />
              </div>
              <span className="text-xs font-bold text-slate-800">Spend</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: Multi-Asset Portfolio Cards */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-bold text-slate-800">My Multi-Asset Portfolio</span>
              <span className="text-base font-extrabold text-slate-900">
                ${(totalPortfolioValue || 12450.32).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[11px]">
                +4.2%
              </span>
            </div>

            <Link
              to="/wallets"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Manage Accounts →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* NGN Card */}
            <div
              onClick={() => setSelectedAccount(ngn)}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-600">NGN</span>
                <MoreVertical size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  NIGERIAN NAIRA
                </p>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  ₦4,250,000
                </p>
                <p className="text-[11px] text-slate-400 mt-1">≈ $2,656.25</p>
              </div>
            </div>

            {/* USD Card */}
            <div
              onClick={() => setSelectedAccount(usd)}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-600">USD</span>
                <MoreVertical size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  US DOLLAR VAULT
                </p>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  $2,100.50
                </p>
                <p className="text-[11px] text-slate-400 mt-1">FedWire Mapped</p>
              </div>
            </div>

            {/* USDT Card */}
            <div
              onClick={() => setSelectedAccount(usdt)}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-600">USDT</span>
                <MoreVertical size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  TETHER STABLECOIN
                </p>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  3,200.00
                </p>
                <p className="text-[11px] text-slate-400 mt-1">ERC-20/Tron</p>
              </div>
            </div>

            {/* BTC Card */}
            <div
              onClick={() => setSelectedAccount(btc)}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-600">BTC</span>
                <MoreVertical size={15} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  BITCOIN CORE
                </p>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  0.0045 BTC
                </p>
                <p className="text-[11px] text-slate-400 mt-1">≈ $4,493.57</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Recent Activity + Allocation Split + Instant Conversion matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent Activity (Left 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Recent Activity</h3>
              <Link
                to="/history"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {[
                {
                  id: 'ra-1',
                  title: 'Salary Deposit',
                  meta: 'System Wire • Today, 10:24 AM',
                  amount: '+$2,500.00',
                  direction: 'in',
                  tone: 'emerald',
                },
                {
                  id: 'ra-2',
                  title: 'Send Money to Emma',
                  meta: 'Universal ID • Yesterday, 3:15 PM',
                  amount: '-$450.00',
                  direction: 'out',
                  tone: 'slate',
                },
                {
                  id: 'ra-3',
                  title: 'Crypto Convert',
                  meta: 'USDT to NGN • Jan 24, 11:02 AM',
                  amount: '₦200,000',
                  direction: 'neutral',
                  tone: 'slate',
                },
                {
                  id: 'ra-4',
                  title: 'Merchant Payment',
                  meta: 'Virtual Card • Jan 23, 8:40 PM',
                  amount: '-$12.50',
                  direction: 'out',
                  tone: 'slate',
                },
                {
                  id: 'ra-5',
                  title: 'Deposit Stable',
                  meta: 'External Wallet • Jan 22, 1:12 PM',
                  amount: '+400.00 USDT',
                  direction: 'in',
                  tone: 'emerald',
                },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        item.direction === 'in'
                          ? 'bg-emerald-50 text-emerald-600'
                          : item.direction === 'out'
                          ? 'bg-slate-50 text-slate-600'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      {item.direction === 'in' ? (
                        <ArrowDownLeft size={15} />
                      ) : item.direction === 'out' ? (
                        <ArrowUpRight size={15} />
                      ) : (
                        <RefreshCw size={14} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.meta}</p>
                    </div>
                  </div>

                  <span
                    className={`font-bold ${
                      item.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation Split & Mini Instant Conversion (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Allocation Split Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Allocation Split</h3>
              <AllocationChart data={allocationSplit} />
            </div>

            {/* Instant Conversion Mini Box matching screenshot */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Instant Conversion</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-900">100.00</span>
                  <span className="font-bold text-slate-600">USD ▾</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-900">160,000.00</span>
                  <span className="font-bold text-emerald-600">NGN ▾</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/convert')}
                className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs tracking-wide transition-colors cursor-pointer shadow-xs"
              >
                Convert Assets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modals */}
      <AccountDetailModal account={selectedAccount} onClose={() => setSelectedAccount(null)} />
    </DashboardLayout>
  )
}
