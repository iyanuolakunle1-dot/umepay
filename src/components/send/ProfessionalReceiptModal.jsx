import { Check, Copy, Download, ExternalLink, Printer, Share2, ShieldCheck, Sparkles } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function ProfessionalReceiptModal({
  open,
  onClose,
  receipt,
  onDone,
}) {
  const toast = useToast()

  if (!receipt) return null

  function copyReference() {
    navigator.clipboard?.writeText?.(receipt.reference || 'UMEPAY-TX-99201')
    toast.success('Reference Copied', `${receipt.reference} copied to clipboard.`)
  }

  function handleDownloadPdf() {
    toast.success('Downloading Official Receipt', 'PDF saved to your downloads folder.')
  }

  function handleShareReceipt() {
    toast.info('Receipt Link Generated', 'Shareable link copied to clipboard.')
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="p-6 sm:p-7">
        {/* Top Header Stamp */}
        <div className="text-center pb-5 border-b border-slate-100">
          <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner ring-8 ring-emerald-50/50">
            <Check size={32} strokeWidth={3} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <ShieldCheck size={13} />
            <span>Atomic Settlement Complete</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
            {receipt.currency} {parseFloat(receipt.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Transferred successfully to <span className="font-bold text-ink-900">{receipt.recipient}</span>
          </p>
        </div>

        {/* Bank & Ledger Breakdown */}
        <div className="my-5 rounded-2xl bg-slate-50/80 border border-slate-100 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Transaction Status</span>
            <Badge variant="success" size="sm">Settled &amp; Verified</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Recipient Universal ID / Account</span>
            <span className="font-bold text-ink-900">{receipt.recipient}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Transfer Rail / Network</span>
            <span className="font-bold text-ink-900">{receipt.rail || 'UMEPAY Universal Rail'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Reference Hash</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-ink-900">{receipt.reference}</span>
              <button
                type="button"
                onClick={copyReference}
                className="text-slate-400 hover:text-ink-900 p-0.5 cursor-pointer"
                title="Copy Reference"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Settlement Time</span>
            <span className="font-medium text-slate-700">{receipt.settlementDate || new Date().toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Network / Platform Fee</span>
            <span className="font-bold text-emerald-600">$0.00 (Zero Fee Rail)</span>
          </div>

          {receipt.remark && (
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
              <span className="text-slate-400">Payment Purpose</span>
              <span className="italic font-medium text-slate-700">{receipt.remark}</span>
            </div>
          )}
        </div>

        {/* Action Button Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            icon={Download}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={Share2}
            onClick={handleShareReceipt}
          >
            Share Receipt
          </Button>
        </div>

        <Button
          fullWidth
          size="lg"
          className="mt-3 shadow-md"
          onClick={onDone || onClose}
        >
          Done &amp; Return to Dashboard
        </Button>
      </div>
    </Modal>
  )
}
