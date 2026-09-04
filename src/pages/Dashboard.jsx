import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  Copy,
  CreditCard,
  MoreVertical,
  QrCode,
  RefreshCw,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Card, { CardHeader } from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import { SkeletonCard, SkeletonRow } from '../components/ui/Skeleton.jsx'
import PortfolioAssetCard from '../components/dashboard/PortfolioAssetCard.jsx'
import ActivityRow from '../components/dashboard/ActivityRow.jsx'
import AllocationChart from '../components/dashboard/AllocationChart.jsx'
import AccountDetailModal from '../components/wallets/AccountDetailModal.jsx'
import DashboardOptionsMenu from '../components/dashboard/DashboardOptionsMenu.jsx'
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
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [universalModalOpen, setUniversalModalOpen] = useState(false)
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [convertModalOpen, setConvertModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [hideBalance, setHideBalance] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750)
    return () => clearTimeout(t)
  }, [])

  const ngn = fiatAccounts.find((a) => a.code === 'NGN')
  const usd = fiatAccounts.find((a) => a.code === 'USD')
  const usdt = digitalAssets.find((a) => a.code === 'USDT')
  const btc = digitalAssets.find((a) => a.code === 'BTC')
  const highlightAssets = [ngn, usd, usdt, btc].filter(Boolean)

  function copyUniversalId() {
    navigator.clipboard?.writeText(user.universalAccountNumber)
    toast.success('Universal account number copied', user.universalAccountNumber)
  }

  function handleToggleHideBalance() {
    setHideBalance((prev) => {
      const next = !prev
      toast.info(next ? 'Balance hidden' : 'Balance visible')
      return next
    })
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Top Universal Card & Action Options */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-stretch">
          {/* Main Navy Universal Card */}
          <div className="relative rounded-3xl bg-[#18224b] text-white p-5 sm:p-7 shadow-popover overflow-visible flex flex-col justify-between">
            <div>
              {/* Header with verified badge and context menu */}
              <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Universal Financial ID
                </span>
                <div className="flex items-center gap-2 relative">
                  {user.kycVerified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-400">
                      ✓ VERIFIED
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/onboarding/kyc')}
                      className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-300 hover:text-amber-200 underline transition-colors"
                    >
                      ⚠️ VERIFY KYC
                    </button>
                  )}

                  {/* 3-Dots Options Menu Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOptionsOpen(!optionsOpen)}
                      className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                      title="Account options menu"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Screenshot 3 Menu */}
                    <DashboardOptionsMenu
                      open={optionsOpen}
                      onClose={() => setOptionsOpen(false)}
                      onViewDetails={() => setUniversalModalOpen(true)}
                      onCopyNumber={copyUniversalId}
                      onTransfer={() => setSendModalOpen(true)}
                      onToggleHideBalance={handleToggleHideBalance}
                      hideBalance={hideBalance}
                      onViewHistory={() => navigate('/history')}
                    />
                  </div>
                </div>
              </div>

              {/* ID / Phone Number */}
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-5">
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white font-mono truncate">
                  {user.phone || `+234 ${user.universalAccountNumber}`}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={copyUniversalId}
                    className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Copy Account Number"
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    onClick={() => setUniversalModalOpen(true)}
                    className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="View QR Code"
                  >
                    <QrCode size={15} />
                  </button>
                </div>
              </div>

              {/* Divider Line */}
              <div className="h-px bg-white/15 w-full my-3 sm:my-4" />

              {/* Portfolio Balance */}
              <div>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-300 mb-1">
                  Total Portfolio Balance
                </p>
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                    {hideBalance
                      ? '••••••••'
                      : `$${totalPortfolioValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
                    +3.4%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Balance Cards & Circular Actions */}
          <div className="flex flex-col justify-between gap-4">
            {/* Balance Mini Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-4">
                <p className="text-xs font-medium text-slate-400 mb-1">NGN Balance</p>
                <p className="text-lg sm:text-xl font-extrabold text-ink-900">
                  {hideBalance ? '••••••' : `₦${ngn ? ngn.balance.toLocaleString() : '4,250,000'}`}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-4">
                <p className="text-xs font-medium text-slate-400 mb-1">USD Balance</p>
                <p className="text-lg sm:text-xl font-extrabold text-ink-900">
                  {hideBalance ? '••••••' : `$${usd ? usd.balance.toLocaleString() : '2,100.50'}`}
                </p>
              </div>
            </div>

            {/* 4 Action Buttons */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSendModalOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-card hover:bg-slate-50 transition-all group active:scale-95 cursor-pointer"
              >
                <div className="h-11 w-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <ArrowUp size={18} strokeWidth={2.4} />
                </div>
                <span className="text-xs font-semibold text-slate-700">Send</span>
              </button>

              <button
                type="button"
                onClick={() => setUniversalModalOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-card hover:bg-slate-50 transition-all group active:scale-95 cursor-pointer"
              >
                <div className="h-11 w-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <ArrowDown size={18} strokeWidth={2.4} />
                </div>
                <span className="text-xs font-semibold text-slate-700">Receive</span>
              </button>

              <button
                type="button"
                onClick={() => setConvertModalOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-card hover:bg-slate-50 transition-all group active:scale-95 cursor-pointer"
              >
                <div className="h-11 w-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <RefreshCw size={18} strokeWidth={2.4} />
                </div>
                <span className="text-xs font-semibold text-slate-700">Convert</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/wallets')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-card hover:bg-slate-50 transition-all group active:scale-95 cursor-pointer"
              >
                <div className="h-11 w-11 rounded-full bg-indigo-50 text-indigo-900 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <CreditCard size={18} strokeWidth={2.4} />
                </div>
                <span className="text-xs font-semibold text-slate-700">Spend</span>
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Assets Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-700">Multi-Asset Balances</p>
            <button
              onClick={() => navigate('/wallets')}
              className="text-xs font-semibold text-ink-700 hover:text-ink-900"
            >
              Manage Accounts →
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : highlightAssets.map((asset) => (
                  <PortfolioAssetCard
                    key={asset.code}
                    asset={asset}
                    symbol={asset.symbol}
                    onViewDetails={(a) => a.accountNumber && setSelectedAccount(a)}
                  />
                ))}
          </div>
        </div>

        {/* Activity & Conversion Grid */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <Card>
            <CardHeader
              title="Recent Activity"
              action={
                <button
                  onClick={() => navigate('/history')}
                  className="text-sm font-semibold text-ink-700 hover:text-ink-900"
                >
                  See All
                </button>
              }
            />
            <div className="divide-y divide-slate-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} className="py-3" />)
                : activity
                    .slice(0, 5)
                    .map((item) => (
                      <ActivityRow
                        key={item.id}
                        item={item}
                        onClick={(it) => setSelectedTransaction(it)}
                      />
                    ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Allocation Split" />
              {loading ? <SkeletonRow /> : <AllocationChart data={allocationSplit} />}
            </Card>

            <Card>
              <CardHeader title="Instant Conversion" />
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3">
                  <span className="font-semibold text-ink-900">100.00</span>
                  <Badge tone="ink">USD</Badge>
                </div>
                <div className="flex justify-center">
                  <ArrowLeftRight size={15} className="text-slate-300" />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3">
                  <span className="font-semibold text-ink-900">160,000.00</span>
                  <Badge tone="ink">NGN</Badge>
                </div>
                <Button
                  fullWidth
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => setConvertModalOpen(true)}
                >
                  Quick Swap
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <UniversalAccountModal
        open={universalModalOpen}
        onClose={() => setUniversalModalOpen(false)}
      />
      <AccountDetailModal account={selectedAccount} onClose={() => setSelectedAccount(null)} />
      <QuickSendModal open={sendModalOpen} onClose={() => setSendModalOpen(false)} />
      <QuickConvertModal open={convertModalOpen} onClose={() => setConvertModalOpen(false)} />
      <TransactionReceiptModal
        item={selectedTransaction}
        open={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
      />
    </DashboardLayout>
  )
}
