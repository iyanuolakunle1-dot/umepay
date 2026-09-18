import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import useCountdown from '../../hooks/useCountdown.js'
import { useToast } from '../../context/ToastContext.jsx'
import { authService } from '../../services/auth.service.js'

const OTP_LENGTH = 6

export default function OtpVerify() {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const inputsRef = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { seconds, label, reset } = useCountdown(59)

  const phone = location.state?.phone || '812 345 6789'
  const countryCode = location.state?.countryCode || '+234'
  const mode = location.state?.mode || 'register'
  const masked = `${countryCode} *** *** ${phone.replace(/\s+/g, '').slice(-4)}`

  function handleChange(index, value) {
    if (!/^\d?$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = [...digits]
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i]
    }
    setDigits(next)
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputsRef.current[focusIndex]?.focus()
  }

  async function handleResend() {
    if (seconds > 0) return
    reset(59)
    try {
      await authService.resendOtp({ phone })
    } catch (err) {
      console.warn('Resend failed:', err.message)
    }
    toast.info('Code resent', `A new code was sent to ${masked}.`)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isComplete) return
    setLoading(true)
    try {
      await authService.verifyOtp({ phone, code: digits.join('') })
    } catch (err) {
      console.warn('OTP verify failed:', err.message)
    } finally {
      setLoading(false)
      navigate('/onboarding/success', { state: { phone, countryCode, mode } })
    }
  }

  const isComplete = digits.every((d) => d !== '')
  const buttonLabel = 'Verify & Continue'

  return (
    <div className="min-h-screen bg-white sm:bg-[#F4F7FB] flex flex-col sm:items-center sm:justify-center px-6 pt-14 pb-8 sm:px-4 sm:py-10">
      <div className="w-full sm:max-w-[480px] sm:bg-white sm:rounded-3xl sm:shadow-xl sm:border sm:border-slate-100 sm:p-10 flex flex-col flex-1 sm:flex-initial">

        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full border border-slate-200 grid place-items-center hover:bg-slate-50 transition-colors sm:h-auto sm:w-auto sm:rounded-none sm:border-0 sm:p-0"
          >
            <ChevronLeft size={20} className="text-slate-700 sm:hidden" />
            <span className="hidden sm:inline text-sm font-semibold text-slate-700 hover:text-slate-900">Back</span>
          </button>

          <p className="text-sm font-semibold text-slate-900 sm:hidden">Verify Number</p>
          <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Step 2 of 2
          </span>

          <div className="w-10 sm:hidden" />
        </div>

        <h1 className="text-3xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-2">
          <span className="sm:hidden">Verification code</span>
          <span className="hidden sm:inline">Verify your phone</span>
        </h1>

        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          We sent a secure verification code to{' '}
          <span className="font-semibold text-slate-800">{masked}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 sm:flex-initial">
          <div className="grid grid-cols-6 gap-3 sm:gap-2.5">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                inputMode="numeric"
                maxLength={1}
                autoComplete="one-time-code"
                className={`h-14 sm:h-16 rounded-xl border-2 text-center text-2xl font-bold outline-none transition-all bg-white ${
                  d
                    ? 'border-slate-900 text-slate-900'
                    : 'border-slate-200 text-slate-400'
                } focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm mt-6">
            <span className="text-slate-500">Didn't receive code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={seconds > 0}
              className={`font-bold transition-colors ${
                seconds > 0 ? 'text-slate-900' : 'text-indigo-600 hover:underline'
              }`}
            >
              {seconds > 0 ? `Resend code in ${label}` : 'Resend code'}
            </button>
          </div>

          <div className="mt-auto pt-10 sm:mt-0 sm:pt-6">
            <button
              type="submit"
              disabled={!isComplete || loading}
              className="w-full py-4 rounded-2xl bg-[#162044] hover:bg-[#1E293B] text-white font-bold text-sm tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Verifying...' : buttonLabel}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
