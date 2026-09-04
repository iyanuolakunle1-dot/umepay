import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import OnboardingShell, { StepBadge } from '../../components/common/OnboardingShell.jsx'
import Button from '../../components/ui/Button.jsx'
import useCountdown from '../../hooks/useCountdown.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function OtpVerify() {
  const [digits, setDigits] = useState(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const inputsRef = useRef([])
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { seconds, label, reset } = useCountdown(59)

  const phone = location.state?.phone || '812 345 6789'
  const mode = location.state?.mode || 'register'
  const masked = `+234 *** *** ${phone.slice(-4)}`

  function handleChange(index, value) {
    if (!/^\d?$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    if (value && index < 5) inputsRef.current[index + 1]?.focus()
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handleAutoFill() {
    setDigits(['1', '2', '3', '4', '5', '6'])
    toast.success('Code Applied', 'Verification OTP (123456) filled.')
  }

  function handleResend() {
    if (seconds > 0) return
    reset(59)
    toast.info('Code resent', `A new verification code was sent to ${masked}.`)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (mode === 'signin') {
        toast.success('Signed in successfully', 'Welcome back to UMEPAY!')
        navigate('/dashboard')
      } else {
        navigate('/onboarding/success', { state: { phone } })
      }
    }, 750)
  }

  const isComplete = digits.every((d) => d !== '')

  return (
    <OnboardingShell>
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink-800 hover:text-ink-900"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <StepBadge>{mode === 'signin' ? 'Sign In OTP' : 'Step 2 of 2'}</StepBadge>
      </div>

      <h1 className="text-2xl font-extrabold text-ink-900 tracking-tight">Verify your phone</h1>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
        We sent a 6-digit secure verification code to <span className="font-semibold text-ink-800">{masked}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              className={`h-13 sm:h-15 rounded-xl border text-center text-xl font-extrabold text-ink-900 outline-none transition-all ${
                d ? 'border-ink-800 ring-2 ring-ink-100 bg-slate-50/50' : 'border-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Quick auto fill helper */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleAutoFill}
            className="inline-flex items-center gap-1 font-semibold text-ink-800 hover:text-black bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
          >
            <Sparkles size={12} className="text-amber-500" /> Instant Code (123456)
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={seconds > 0}
            className={`font-semibold ${
              seconds > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-ink-800 hover:underline'
            }`}
          >
            {seconds > 0 ? `Resend in ${label}` : 'Resend Code'}
          </button>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          className="mt-6"
          loading={loading}
          disabled={!isComplete}
          icon={ArrowRight}
          iconPosition="right"
        >
          {mode === 'signin' ? 'Sign In to Dashboard' : 'Verify & Complete'}
        </Button>
      </form>
    </OnboardingShell>
  )
}
