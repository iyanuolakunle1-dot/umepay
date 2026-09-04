import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Card, { CardHeader } from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import Modal, { ModalHeader } from '../components/ui/Modal.jsx'
import Input from '../components/ui/Input.jsx'
import { SkeletonRow } from '../components/ui/Skeleton.jsx'
import WalletRow from '../components/wallets/WalletRow.jsx'
import DigitalAssetRow from '../components/wallets/DigitalAssetRow.jsx'
import AccountDetailModal from '../components/wallets/AccountDetailModal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Wallets() {
  const { fiatAccounts, digitalAssets, totalPortfolioValue } = useApp()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linking, setLinking] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  function handleLink(e) {
    e.preventDefault()
    setLinking(true)
    setTimeout(() => {
      setLinking(false)
      setLinkOpen(false)
      toast.success('Account linking requested', 'We will notify you once verification completes.')
    }, 1100)
  }

  return (
    <DashboardLayout title="Wallets & Accounts">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Total Multi-Asset Portfolio Value
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-3xl font-extrabold text-ink-900">
              ${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <Badge tone="emerald">+4.2% (24h)</Badge>
          </div>
        </div>
        <Button icon={Plus} onClick={() => setLinkOpen(true)}>
          Link New Account
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader title="Fiat Accounts" />
          <div className="divide-y divide-slate-50">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} className="py-4" />)
              : fiatAccounts.map((a) => (
                  <WalletRow key={a.id} account={a} onClick={setSelectedAccount} />
                ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Digital Assets" />
          <div className="divide-y divide-slate-50">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} className="py-4" />)
              : digitalAssets.map((a) => <DigitalAssetRow key={a.id} asset={a} />)}
          </div>
        </Card>
      </div>

      <AccountDetailModal account={selectedAccount} onClose={() => setSelectedAccount(null)} />

      <Modal open={linkOpen} onClose={() => !linking && setLinkOpen(false)} size="sm">
        <ModalHeader title="Link New Account" onClose={() => !linking && setLinkOpen(false)} />
        <form onSubmit={handleLink} className="p-6 pt-4 space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Account Type
            </span>
            <select className="w-full h-11 rounded-xl border border-slate-200 px-3.5 text-[15px] outline-none focus:border-ink-500 focus:ring-2 focus:ring-ink-100">
              <option>Bank Account (Fiat)</option>
              <option>Stablecoin Wallet</option>
              <option>Crypto Wallet</option>
            </select>
          </label>
          <Input label="Bank / Provider Name" placeholder="e.g. GTBank, Coinbase" required />
          <Input label="Account / Wallet Number" placeholder="Enter account or wallet number" required />
          <Button type="submit" fullWidth loading={linking} className="!mt-2">
            Request Link
          </Button>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
