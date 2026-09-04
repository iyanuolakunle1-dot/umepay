import { Copy } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useApp } from '../../context/AppContext.jsx'

export default function AccountDetailModal({ account, onClose }) {
  const toast = useToast()
  const { user, activity } = useApp()

  if (!account) return null

  const relatedTx = activity.filter((t) => t.asset === account.code).slice(0, 3)

  function copyNumber() {
    navigator.clipboard?.writeText(account.accountNumber)
    toast.success('Account number copied')
  }

  return (
    <Modal open={!!account} onClose={onClose} size="sm" className="!rounded-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Badge tone={account.accent}>{account.code}</Badge>
            <h2 className="font-semibold text-ink-900">{account.name} Account</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 grid place-items-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="rounded-xl bg-ink-50 p-4 mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total Wallet Balance</p>
          <p className="text-2xl font-bold text-ink-900">
            {account.symbol}
            {account.balance.toLocaleString()}
          </p>
          {account.heldForSettlement ? (
            <p className="text-xs text-slate-400 mt-1.5">
              Available: {account.symbol}
              {(account.balance - account.heldForSettlement).toLocaleString()} ({account.symbol}
              {account.heldForSettlement.toLocaleString()} held for pending standard settlement)
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-100 divide-y divide-slate-100 mb-4">
          <div className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span className="text-slate-400">Virtual Bank Name</span>
            <span className="font-semibold text-ink-900">{account.bankName}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span className="text-slate-400">Account Number</span>
            <button onClick={copyNumber} className="flex items-center gap-1.5 font-semibold text-ink-900">
              {account.accountNumber}
              <Copy size={14} className="text-slate-400" />
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span className="text-slate-400">Beneficiary Name</span>
            <span className="font-semibold text-ink-900">{user.name}</span>
          </div>
        </div>

        {relatedTx.length > 0 && (
          <div className="mb-5">
            <p className="text-sm font-semibold text-ink-900 mb-2">
              Last {relatedTx.length} {account.code} Transactions
            </p>
            <div className="space-y-1.5">
              {relatedTx.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 text-sm"
                >
                  <span className="text-ink-700">{t.description}</span>
                  <span
                    className={`font-semibold ${
                      t.direction === 'in' ? 'text-emerald-600' : 'text-ink-900'
                    }`}
                  >
                    {t.direction === 'in' ? '+' : t.direction === 'out' ? '-' : ''}
                    {account.symbol}
                    {t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <Button variant="primary" size="sm">
            Transfer
          </Button>
          <Button variant="secondary" size="sm">
            Fund Account
          </Button>
          <Button variant="outline" size="sm">
            Statement
          </Button>
        </div>
      </div>
    </Modal>
  )
}
