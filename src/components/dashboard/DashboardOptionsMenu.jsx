import { useEffect, useRef } from 'react'
import { ArrowLeftRight, Copy, Eye, EyeOff, History, QrCode, Scan } from 'lucide-react'

export default function DashboardOptionsMenu({
  open,
  onClose,
  onViewDetails,
  onCopyNumber,
  onTransfer,
  onToggleHideBalance,
  hideBalance,
  onViewHistory,
}) {
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.()
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white shadow-popover border border-slate-100 p-2 z-40 text-slate-800 animate-scale-in"
    >
      <button
        type="button"
        onClick={() => {
          onViewDetails?.()
          onClose?.()
        }}
        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-slate-50 text-[14px] font-semibold text-slate-800 transition-colors text-left"
      >
        <Scan size={18} className="text-slate-600 shrink-0" strokeWidth={2.2} />
        <span>View Account Details</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onCopyNumber?.()
          onClose?.()
        }}
        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-slate-50 text-[14px] font-semibold text-slate-800 transition-colors text-left"
      >
        <Copy size={18} className="text-slate-600 shrink-0" strokeWidth={2.2} />
        <span>Copy Account Number</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onTransfer?.()
          onClose?.()
        }}
        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-slate-50 text-[14px] font-semibold text-slate-800 transition-colors text-left"
      >
        <ArrowLeftRight size={18} className="text-slate-600 shrink-0" strokeWidth={2.2} />
        <span>Transfer from Account</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onToggleHideBalance?.()
          onClose?.()
        }}
        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-slate-50 text-[14px] font-semibold text-slate-800 transition-colors text-left"
      >
        {hideBalance ? (
          <>
            <Eye size={18} className="text-slate-600 shrink-0" strokeWidth={2.2} />
            <span>Show Balance</span>
          </>
        ) : (
          <>
            <EyeOff size={18} className="text-slate-600 shrink-0" strokeWidth={2.2} />
            <span>Hide Balance</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => {
          onViewHistory?.()
          onClose?.()
        }}
        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-slate-50 text-[14px] font-semibold text-slate-800 transition-colors text-left"
      >
        <History size={18} className="text-slate-600 shrink-0" strokeWidth={2.2} />
        <span>Transaction History</span>
      </button>
    </div>
  )
}
