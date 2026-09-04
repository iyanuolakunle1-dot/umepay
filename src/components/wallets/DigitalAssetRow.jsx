import Badge from '../ui/Badge.jsx'

function Sparkline({ positive }) {
  const points = positive ? '0,18 12,14 24,16 36,8 48,10 60,3' : '0,4 12,8 24,6 36,13 48,11 60,17'
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="hidden sm:block shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#059669' : '#E11D48'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DigitalAssetRow({ asset }) {
  const positive = asset.changePct >= 0
  return (
    <div className="flex items-center gap-3 py-4">
      <Badge tone={asset.accent} className="!h-9 !w-9 !rounded-full !p-0 grid place-items-center text-[11px]">
        {asset.code}
      </Badge>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 truncate">{asset.name}</p>
        <p className="text-xs text-slate-400 truncate">
          {asset.balance} {asset.code}
        </p>
      </div>
      <Sparkline positive={positive} />
      <div className="text-right shrink-0 w-20">
        <p className={`text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {positive ? '+' : ''}
          {asset.changePct}%
        </p>
        <p className="text-sm font-bold text-ink-900">${asset.usdEquivalent.toLocaleString()}</p>
      </div>
    </div>
  )
}
