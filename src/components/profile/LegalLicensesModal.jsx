import { useState } from 'react'
import { CheckCircle, FileText, Lock, ShieldCheck } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'

export default function LegalLicensesModal({ open, onClose }) {
  const [tab, setTab] = useState('licenses') // 'licenses' | 'terms' | 'privacy'

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Legal, Licenses &amp; Compliance" onClose={onClose} />
      <div className="p-6 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setTab('licenses')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'licenses'
                ? 'bg-white text-ink-900 shadow-xs'
                : 'text-slate-500 hover:text-ink-900'
            }`}
          >
            Regulatory Licenses
          </button>
          <button
            onClick={() => setTab('terms')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'terms'
                ? 'bg-white text-ink-900 shadow-xs'
                : 'text-slate-500 hover:text-ink-900'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setTab('privacy')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'privacy'
                ? 'bg-white text-ink-900 shadow-xs'
                : 'text-slate-500 hover:text-ink-900'
            }`}
          >
            Privacy &amp; Data
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto pr-1 space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {tab === 'licenses' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <ShieldCheck size={18} />
                  <span>FinCEN Registered Money Services Business (MSB)</span>
                </div>
                <p className="text-xs text-slate-500">
                  Registration No: <span className="font-mono font-bold text-slate-800">31000289110294</span>
                </p>
                <p className="text-xs text-slate-500">
                  Authorized under federal law for multi-currency transmission and virtual asset settlement.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <CheckCircle size={18} />
                  <span>Licensed Banking &amp; Custody Partners</span>
                </div>
                <p className="text-xs text-slate-500">
                  Partner deposit institutions: <span className="font-semibold text-slate-800">Wema Bank Plc, Standard Chartered Bank, Barclays UK (FPS)</span>.
                </p>
                <p className="text-xs text-slate-500">
                  Customer fiat deposits are FDIC/NDIC insured up to eligible statutory limits via partner sponsor banks.
                </p>
              </div>
            </div>
          )}

          {tab === 'terms' && (
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-ink-900 text-sm mb-2">UMEPAY Universal ID User Agreement</h4>
              <p>
                1. <strong>Binding Identity:</strong> By linking your verified phone number to UMEPAY, you acknowledge that your phone number acts as your Universal Financial ID for incoming and outgoing settlement.
              </p>
              <p>
                2. <strong>Settlement Finality:</strong> Outbound blockchain transfers executed to non-custodial external addresses are irreversible once confirmed on the respective network rail.
              </p>
              <p>
                3. <strong>Anti-Money Laundering (AML):</strong> In compliance with global financial regulations, transactions exceeding Tier 1 limits require verifiable Tier 2 identification.
              </p>
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-ink-900 text-sm mb-2">Privacy &amp; Cryptographic Masking</h4>
              <p>
                1. <strong>Zero Plaintext Storage:</strong> Your private financial keys and biometric vectors are stored strictly on-device using secure hardware enclaves.
              </p>
              <p>
                2. <strong>Public Resolution:</strong> Counterparties querying your Universal ID only receive cryptographically signed payment addresses without exposing your underlying bank account numbers or personal addresses.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
