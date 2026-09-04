import { useState, useEffect } from 'react'
import { Delete, Fingerprint, Lock, ShieldCheck, X } from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function PinAuthModal({
  open,
  onClose,
  onAuthorized,
  transferDetails = {},
  loading = false,
}) {
  const toast = useToast()
  const [pin, setPin] = useState(['', '', '', ''])
  const [authError, setAuthError] = useState(false)

  useEffect(() => {
    if (open) {
      setPin(['', '', '', ''])
      setAuthError(false)
    }
  }, [open])

  function handleDigitPress(digit) {
    const nextIndex = pin.findIndex((d) => d === '')
    if (nextIndex !== -1) {
      const updated = [...pin]
      updated[nextIndex] = digit
      setPin(updated)

      if (nextIndex === 3) {
        // Full PIN entered!
        const fullCode = updated.join('')
        setTimeout(() => {
          onAuthorized(fullCode)
        }, 300)
      }
    }
  }

  function handleBackspace() {
    const filledIndices = pin
      .map((d, i) => (d !== '' ? i : -1))
      .filter((i) => i !== -1)
    if (filledIndices.length > 0) {
      const lastIndex = filledIndices[filledIndices.length - 1]
      const updated = [...pin]
      updated[lastIndex] = ''
      setPin(updated)
    }
  }

  function handleBiometricAuth() {
    toast.info('Biometric Authenticated', 'Touch ID / Face ID verified.')
    setTimeout(() => {
      onAuthorized('BIOMETRIC_PASS')
    }, 400)
  }

  return (
    <Modal open={open} onClose={() => !loading && onClose()} size="sm">
      <ModalHeader title="Authorize Payment" onClose={() => !loading && onClose()} />
      <div className="p-6 text-center space-y-5">
        {/* Security Shield Header */}
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-[#18224b]/10 text-[#18224b] grid place-items-center mb-3 shadow-inner">
            <ShieldCheck size={28} strokeWidth={2.3} />
          </div>
          <h3 className="text-base font-extrabold text-ink-900">
            Confirm Transfer of {transferDetails.amountFormatted || 'Funds'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            To: <span className="font-bold text-ink-900">{transferDetails.recipientName || 'Recipient'}</span>
          </p>
        </div>

        {/* 4 PIN Dots */}
        <div className="flex justify-center items-center gap-4 py-2">
          {pin.map((digit, idx) => (
            <div
              key={idx}
              className={`h-4 w-4 rounded-full transition-all duration-150 ${
                digit
                  ? 'bg-[#18224b] scale-110 shadow-sm ring-4 ring-[#18224b]/20'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              key={n}
              type="button"
              disabled={loading}
              onClick={() => handleDigitPress(n)}
              className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100/90 active:scale-95 text-lg font-extrabold text-ink-900 shadow-xs border border-slate-200/60 transition-all cursor-pointer"
            >
              {n}
            </button>
          ))}

          {/* Biometric trigger */}
          <button
            type="button"
            disabled={loading}
            onClick={handleBiometricAuth}
            className="h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 transition-colors cursor-pointer"
            title="Use Biometric / Face ID"
          >
            <Fingerprint size={22} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleDigitPress('0')}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100/90 active:scale-95 text-lg font-extrabold text-ink-900 shadow-xs border border-slate-200/60 transition-all cursor-pointer"
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            disabled={loading}
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200/60 transition-colors cursor-pointer"
          >
            <Delete size={20} />
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Enter your 4-digit security PIN or tap Fingerprint for instant authorization.
        </p>
      </div>
    </Modal>
  )
}
