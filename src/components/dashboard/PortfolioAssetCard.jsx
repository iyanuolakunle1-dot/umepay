import { useState } from 'react'
import { ArrowLeftRight, Copy, Eye, EyeOff, MoreVertical, ScrollText, Wallet2 } from 'lucide-react'
import Dropdown, { DropdownItem } from '../ui/Dropdown.jsx'
import Badge from '../ui/Badge.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const toneMap = {
  emerald: 'text-emerald-600',
  blue: 'text-blue-600',
  violet: 'text-violet-600',
  orange: 'text-orange-600',
  indigo: 'text-indigo-600',
}

function formatBalance(value, code) {
  const isCrypto = ['BTC', 'ETH'].includes(code)
  return value.toLocaleString(undefined, {
    minimumFractionDigits: isCrypto ? 4 : 2,
    maximumFractionDigits: isCrypto ? 4 : 2,
  })
}

export default function PortfolioAssetCard({ asset, symbol, onViewDetails }) {
  const toast = useToast()
  const [hidden, setHidden] = useState(false)
  const tone = toneMap[asset.accent] || 'text-ink-700'
  const displayBalance = hidden
    ? '••••••'
    : `${symbol || ''}${formatBalance(asset.balance, asset.code)}`

  function copyAccountNumber() {
    navigator.clipboard?.writeText(asset.accountNumber || asset.code)
    toast.success('Copied to clipboard', `${asset.code} account number copied.`)
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5 flex flex-col gap-2 min-w-0">
      <div className="flex items-center justify-between">
        <Badge tone={asset.accent}>{asset.code}</Badge>
        <Dropdown
          align="right"
          trigger={
            <button
              aria-label="Account options"
              className="h-7 w-7 grid place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <MoreVertical size={16} />
            </button>
          }
        >
          {({ close }) => (
            <div className="py-1.5">
              <DropdownItem
                icon={Wallet2}
                onClick={() => {
                  onViewDetails?.(asset)
                  close()
                }}
              >
                View Account Details
              </DropdownItem>
              <DropdownItem
                icon={Copy}
                onClick={() => {
                  copyAccountNumber()
                  close()
                }}
              >
                Copy Account Number
              </DropdownItem>
              <DropdownItem icon={ArrowLeftRight} onClick={close}>
                Transfer from Account
              </DropdownItem>
              <DropdownItem
                icon={hidden ? Eye : EyeOff}
                onClick={() => {
                  setHidden((h) => !h)
                  close()
                }}
              >
                {hidden ? 'Show Balance' : 'Hide Balance'}
              </DropdownItem>
              <DropdownItem icon={ScrollText} onClick={close}>
                Transaction History
              </DropdownItem>
            </div>
          )}
        </Dropdown>
      </div>

      <p className="text-xs font-medium text-slate-400 truncate">{asset.name}</p>
      <p className="text-2xl font-bold text-ink-900 truncate">{displayBalance}</p>

      <div className="flex items-center justify-between text-xs mt-0.5">
        <span className="text-slate-400">{asset.tag || asset.network || asset.bankName}</span>
        {typeof asset.changePct === 'number' && (
          <span className={asset.changePct >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
            {asset.changePct >= 0 ? '+' : ''}
            {asset.changePct}%
          </span>
        )}
      </div>
    </div>
  )
}
