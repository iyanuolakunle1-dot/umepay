import { Check, Share2 } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function SuccessReceiptModal({ open, onClose, title, message, rows, primaryLabel, onPrimary }) {
  const toast = useToast()

  function shareReceipt() {
    toast.info('Receipt link copied', 'Share it with the recipient for their records.')
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="p-6 sm:p-7 text-center">
        <div className="h-14 w-14 rounded-full bg-emerald-50 grid place-items-center mx-auto mb-4">
          <Check size={24} className="text-emerald-600" strokeWidth={3} />
        </div>
        <h2 className="text-xl font-extrabold text-ink-900">{title}</h2>
        <p className="mt-1.5 text-sm text-slate-500">{message}</p>

        <div className="mt-5 rounded-xl border border-slate-100 divide-y divide-slate-100 text-left">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-slate-400">{r.label}</span>
              <span className="font-semibold text-ink-900">{r.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <Button variant="outline" icon={Share2} onClick={shareReceipt}>
            Share Receipt
          </Button>
          <Button onClick={onPrimary}>{primaryLabel}</Button>
        </div>
      </div>
    </Modal>
  )
}
