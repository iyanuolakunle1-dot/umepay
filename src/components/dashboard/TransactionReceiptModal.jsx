import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Check, Copy, Download, Share2, ShieldCheck, X } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function TransactionReceiptModal({ item, open, onClose }) {
  const toast = useToast()

  if (!item) return null

  function handleCopyReference() {
    if (item.reference || item.id) {
      navigator.clipboard?.writeText(item.reference || item.id)
      toast.success('Reference Copied', item.reference || item.id)
    }
  }

  function handleDownload() {
    toast.success('Receipt Downloaded', `Receipt for ${item.description || 'Transaction'} saved as PDF.`)
  }

  const isPositive = item.direction === 'in'

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title="Transaction Receipt" onClose={onClose} />
      <div className="p-6 text-center space-y-4">
        {/* Status Icon */}
        <div
          className={`h-16 w-16 rounded-full mx-auto grid place-items-center ${
            item.status === 'Failed'
              ? 'bg-rose-50 text-rose-600'
              : isPositive
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-[#18224b]/10 text-[#18224b]'
          }`}
        >
          {isPositive ? (
            <ArrowDownLeft size={30} strokeWidth={2.5} />
          ) : (
            <ArrowUpRight size={30} strokeWidth={2.5} />
          )}
        </div>

        <div>
          <p className="text-2xl font-black text-ink-900 tracking-tight">
            {isPositive ? '+' : '-'}
            {item.currencyPrefix || '$'}
            {item.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs font-bold text-slate-500 mt-1">{item.description}</p>
          <Badge tone={item.status === 'Failed' ? 'rose' : 'emerald'} className="mt-2">
            ✓ {item.status || 'Success'}
          </Badge>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 text-left border border-slate-100 text-xs space-y-2.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Date &amp; Time</span>
            <span className="font-semibold text-ink-900">
              {item.date}, {item.time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Asset / Rail</span>
            <span className="font-bold text-ink-900">{item.asset}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Network Fee</span>
            <span className="font-bold text-emerald-600">Free ($0.00)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Reference ID</span>
            <button
              type="button"
              onClick={handleCopyReference}
              className="inline-flex items-center gap-1 font-mono font-bold text-ink-800 hover:text-amber-600"
            >
              <span>{item.reference || item.id}</span>
              <Copy size={12} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" size="md" icon={Download} onClick={handleDownload}>
            Download PDF
          </Button>
          <Button size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
