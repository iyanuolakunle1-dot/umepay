import { useState } from 'react'
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Crown,
  FileCheck,
  FileText,
  Lock,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function TierUpgradeModal({ open, onClose }) {
  const { user, updateUser } = useApp()
  const toast = useToast()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [docType, setDocType] = useState('Utility Bill (Electricity/Water)')
  const [addressProofFile, setAddressProofFile] = useState(null)
  const [sourceOfWealth, setSourceOfWealth] = useState('Employment / Salary Income')
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState('$50,000 - $250,000')
  const [taxId, setTaxId] = useState('')

  const isAlreadyTier3 = user.tier?.includes('Tier 3')

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (file) {
      setAddressProofFile({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      })
      toast.success('Document uploaded', file.name)
    }
  }

  function handleUpgradeSubmit() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      updateUser({
        tier: 'Personal Tier 3 (VIP)',
        dailySendLimit: 250000,
        dailyReceiveLimit: null,
        tierLevel: 3,
      })
      toast.success('Tier 3 VIP Upgrade Approved!', 'Your daily limit has been increased to $250,000.00.')
      setStep(3) // Success step
    }, 1500)
  }

  function handleClose() {
    setStep(1)
    setAddressProofFile(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} size="lg">
      <ModalHeader
        title={isAlreadyTier3 ? 'VIP Account Status' : 'Upgrade to Tier 3 (VIP)'}
        onClose={handleClose}
      />

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#18224b] to-[#28397a] text-white p-5 flex items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
                  <Crown size={14} /> Tier 3 VIP Enterprise
                </div>
                <h3 className="text-lg font-extrabold">Unlock $250,000.00 Daily Limit</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Higher transaction allowances, dedicated OTC desk, zero wire fees, and concierge support.
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-white/10 grid place-items-center text-amber-400 shrink-0">
                <Sparkles size={28} />
              </div>
            </div>

            {/* Comparison Ladder */}
            <div className="grid sm:grid-cols-3 gap-3">
              {/* Tier 1 */}
              <div className="rounded-xl border border-slate-200 p-4 text-left bg-slate-50/50">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Tier 1 (Basic)
                </span>
                <p className="text-base font-extrabold text-ink-900 mt-1">$5,000 / day</p>
                <p className="text-xs text-slate-500 mt-2">SMS OTP &amp; Basic ID verification.</p>
                <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                  <Check size={13} className="text-slate-400" /> Standard Routing
                </div>
              </div>

              {/* Tier 2 */}
              <div
                className={`rounded-xl border p-4 text-left ${
                  !isAlreadyTier3
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Tier 2 (Verified)
                  </span>
                  {!isAlreadyTier3 && (
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      CURRENT
                    </span>
                  )}
                </div>
                <p className="text-base font-extrabold text-ink-900 mt-1">$50,000 / day</p>
                <p className="text-xs text-slate-500 mt-2">Govt ID &amp; Biometric face match.</p>
                <div className="mt-3 text-xs text-emerald-700 flex items-center gap-1">
                  <Check size={13} className="text-emerald-600" /> Unlimited Incoming
                </div>
              </div>

              {/* Tier 3 */}
              <div
                className={`rounded-xl border p-4 text-left ${
                  isAlreadyTier3
                    ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                    : 'border-amber-400 bg-amber-50/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                    Tier 3 (VIP)
                  </span>
                  {isAlreadyTier3 ? (
                    <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      RECOMMENDED
                    </span>
                  )}
                </div>
                <p className="text-base font-extrabold text-ink-900 mt-1">$250,000 / day</p>
                <p className="text-xs text-slate-500 mt-2">Proof of Address &amp; Wealth verification.</p>
                <div className="mt-3 text-xs text-amber-800 flex items-center gap-1 font-semibold">
                  <Check size={13} className="text-amber-600" /> Zero Wire FX Markup
                </div>
              </div>
            </div>

            {/* Perks list */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Tier 3 VIP Benefits:
              </p>
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-ink-800 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-amber-500 shrink-0" />
                  <span>$250,000 daily outgoing limit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-amber-500 shrink-0" />
                  <span>Dedicated Private Key VIP Account Manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-amber-500 shrink-0" />
                  <span>Direct FedNow &amp; SEPA Instant Priority Clear</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-amber-500 shrink-0" />
                  <span>Custom branded physical &amp; metal Visa card</span>
                </div>
              </div>
            </div>

            {isAlreadyTier3 ? (
              <div className="text-center py-2">
                <Badge tone="amber" className="px-4 py-1.5 text-xs font-bold">
                  ✓ You are enjoying full Tier 3 VIP limits
                </Badge>
              </div>
            ) : (
              <Button
                onClick={() => setStep(2)}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full shadow-md"
              >
                Proceed with Tier 3 Application
              </Button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-ink-900">Proof of Address &amp; Source of Wealth</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Financial compliance regulations require verified residential address and source of funds for limits above $50k/day.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink-900 uppercase tracking-wider mb-1.5">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-ink-800"
                >
                  <option>Utility Bill (Electricity/Water - within 90 days)</option>
                  <option>Bank Account Statement (Stamped)</option>
                  <option>Tenancy Agreement / Lease</option>
                  <option>Local Government Tax Receipt</option>
                </select>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-ink-900 uppercase tracking-wider mb-1.5">
                  Upload Proof of Address Document
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-ink-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {addressProofFile ? (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
                        <FileCheck size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-ink-900">{addressProofFile.name}</p>
                        <p className="text-xs text-emerald-600 font-medium">
                          {addressProofFile.size} • Ready for verification
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="h-11 w-11 rounded-xl bg-white text-ink-700 grid place-items-center shadow-sm mb-2">
                        <Upload size={20} />
                      </div>
                      <p className="text-sm font-bold text-ink-900">Click to upload document file</p>
                      <p className="text-xs text-slate-400 mt-1">
                        PDF, JPG, or PNG (Max 10MB). Must clearly show your name and address.
                      </p>
                    </>
                  )}
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-900 uppercase tracking-wider mb-1.5">
                    Primary Source of Funds
                  </label>
                  <select
                    value={sourceOfWealth}
                    onChange={(e) => setSourceOfWealth(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-ink-800"
                  >
                    <option>Employment / Salary Income</option>
                    <option>Business Revenue / Company Dividends</option>
                    <option>Investments &amp; Capital Gains</option>
                    <option>Crypto &amp; Digital Assets Trading</option>
                    <option>Inheritance / Real Estate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-900 uppercase tracking-wider mb-1.5">
                    Expected Monthly Volume
                  </label>
                  <select
                    value={estimatedMonthlyVolume}
                    onChange={(e) => setEstimatedMonthlyVolume(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-ink-800"
                  >
                    <option>$50,000 - $250,000</option>
                    <option>$250,000 - $1,000,000</option>
                    <option>$1,000,000+ (Institutional)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(1)} disabled={submitting}>
                Back
              </Button>
              <Button
                onClick={handleUpgradeSubmit}
                disabled={submitting}
                className="px-6"
              >
                {submitting ? 'Verifying Documents...' : 'Submit & Upgrade to Tier 3'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6 space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto">
              <Check size={32} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-ink-900">Tier 3 VIP Upgraded Successfully!</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Your account is now elevated to Personal Tier 3. Your daily send limit is increased to $250,000.00.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 max-w-sm mx-auto text-left space-y-2 border border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Tier</span>
                <span className="font-bold text-ink-900">Personal Tier 3 (VIP)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">New Daily Send Limit</span>
                <span className="font-bold text-emerald-600">$250,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Incoming Settlement</span>
                <span className="font-bold text-ink-900">Unlimited Priority</span>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full max-w-sm mx-auto">
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
