const toneBg = {
  emerald: 'bg-emerald-600',
  blue: 'bg-blue-600',
  violet: 'bg-violet-600',
}

export default function WalletRow({ account, onClick }) {
  return (
    <button
      onClick={() => onClick(account)}
      className="w-full flex items-center gap-3 py-4 text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors"
    >
      <div
        className={`h-10 w-10 rounded-full grid place-items-center text-white font-bold text-sm shrink-0 ${
          toneBg[account.accent] || 'bg-ink-700'
        }`}
      >
        {account.bankName?.[0] || account.code[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 truncate">{account.bankName} {account.code}</p>
        <p className="text-xs text-slate-400 truncate">
          {account.shortLabel} {account.accountMask}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-ink-900">
          {account.symbol}
          {account.balance.toLocaleString()}
        </p>
        <p className="text-xs text-slate-400">≈ ${account.usdEquivalent.toLocaleString()}</p>
      </div>
    </button>
  )
}
