import { useState } from 'react'
import { Copy, Check, Download, ShieldCheck, Share2 } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import QrCode from '../common/QrCode.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function UniversalAccountModal({ open, onClose }) {
  const { user, totalPortfolioValue } = useApp()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('qr') // 'qr' | 'details'
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const paymentUri = `umepay:${(user.phone || user.universalAccountNumber).replace(/\s/g, '')}`

  function copy(label, value) {
    navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success(`${label} copied`, value)
  }

  function downloadQr() {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = `umepay-id-${user.name.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('QR code downloaded')
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader title="Universal Account Details" onClose={onClose} />
      <div className="p-6 space-y-5">
        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'qr'
                ? 'bg-white text-ink-900 shadow-xs'
                : 'text-slate-500 hover:text-ink-900'
            }`}
          >
            Universal QR Code
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'details'
                ? 'bg-white text-ink-900 shadow-xs'
                : 'text-slate-500 hover:text-ink-900'
            }`}
          >
            Account Details &amp; Rails
          </button>
        </div>

        {activeTab === 'qr' ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <QrCode
                value={paymentUri}
                size={200}
                className="border border-slate-100 shadow-sm"
              />
            </div>
            <div>
              <p className="text-base font-extrabold text-ink-900">{user.name}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.phone || user.universalAccountNumber}</p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={copied ? Check : Copy}
                onClick={() => copy('Account Number', user.phone || user.universalAccountNumber)}
              >
                {copied ? 'Copied' : 'Copy ID'}
              </Button>
              <Button variant="secondary" size="sm" icon={Download} onClick={downloadQr}>
                Download QR
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Account Holder</span>
                <span className="font-bold text-ink-900">{user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Universal ID / Phone</span>
                <span className="font-bold text-ink-900 font-mono">{user.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">KYC Status</span>
                {user.kycVerified ? (
                  <Badge tone="emerald">Verified Tier 2</Badge>
                ) : (
                  <Badge tone="amber">Pending Verification</Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Daily Send Limit</span>
                <span className="font-bold text-ink-900">
                  ${(user.dailySendLimit || 50000).toLocaleString()}.00
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 p-4 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Connected Rails</p>
              <div className="flex items-center gap-2 text-xs font-semibold text-ink-800">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>ACH Routing • FedWire • SEPA Instant • Tron/ERC-20</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
