import { useState } from 'react'
import { Check, Copy, Download, Share2 } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import QrCode from '../components/common/QrCode.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { supportedReceiveAssets } from '../data/mockData.js'

const badgeTone = {
  NGN: 'violet',
  USD: 'orange',
  USDT: 'emerald',
  USDC: 'blue',
  BTC: 'amber',
  ETH: 'indigo',
}

export default function ReceivePayment() {
  const { user } = useApp()
  const toast = useToast()
  const [copied, setCopied] = useState(false)

  const paymentUri = `umepay:${(user.phone || user.universalAccountNumber).replace(/\s/g, '')}`

  function copy(label, value) {
    navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success(`${label} copied`, value)
  }

  function shareLink() {
    const link = `https://umepay.me/pay/${(user.phone || user.universalAccountNumber).replace(/\s/g, '')}`
    navigator.clipboard?.writeText(link)
    toast.info('Payment link copied', 'Anyone with this link can send payments directly to your ID.')
  }

  function downloadQr() {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = `umepay-qr-${user.name.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('QR code downloaded', 'Saved high-res PNG image to your device.')
    } else {
      toast.error('Download error', 'Unable to capture QR code canvas.')
    }
  }

  return (
    <DashboardLayout title="Receive Payment">
      <div className="max-w-xl mx-auto space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Your Universal Cash Address
            </p>
            <Badge tone="emerald">Verified ID</Badge>
          </div>
          <p className="text-xs text-slate-400 mb-1">Account Name</p>
          <p className="text-xl font-extrabold text-ink-900 mb-4">{user.name}</p>
          <p className="text-xs text-slate-400 mb-1">Universal Financial ID / Account Number</p>
          <button
            onClick={() => copy('Universal ID', user.phone || user.universalAccountNumber)}
            className="flex items-center gap-2 group text-left"
          >
            <span className="text-2xl font-extrabold text-ink-900 tracking-tight">
              {user.phone || user.universalAccountNumber}
            </span>
            {copied ? (
              <Check size={18} className="text-emerald-500" />
            ) : (
              <Copy size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            )}
          </button>
        </Card>

        <Card className="text-center">
          <p className="text-sm font-bold text-ink-900 mb-2">Scan QR to Pay Instantly</p>
          <p className="text-xs text-slate-400 mb-6">
            Accepts multi-currency fiat routes (USD, NGN, GBP) and stablecoins (USDT, USDC).
          </p>

          <div className="flex justify-center my-2">
            <QrCode
              value={paymentUri}
              size={220}
              className="border border-slate-200/80 shadow-md"
            />
          </div>

          <p className="text-xs text-slate-500 font-mono mt-3">
            {user.phone || user.universalAccountNumber}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" icon={Share2} onClick={shareLink}>
              Share Link
            </Button>
            <Button icon={Download} onClick={downloadQr}>
              Download QR
            </Button>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
            Supported Receive Assets
          </p>
          <div className="flex flex-wrap gap-2">
            {supportedReceiveAssets.map((code) => (
              <Badge key={code} tone={badgeTone[code] || 'slate'}>
                {code}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
