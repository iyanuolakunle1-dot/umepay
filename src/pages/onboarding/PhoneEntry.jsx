import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, Sparkles, UserCheck } from 'lucide-react'
import OnboardingShell, { StepBadge } from '../../components/common/OnboardingShell.jsx'
import Button from '../../components/ui/Button.jsx'
import CountryCodeDropdown from '../../components/common/CountryCodeDropdown.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const trustPoints = ['Universal Identity', 'Instant Verification', 'Non-Custodial Option']

export default function PhoneEntry() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { user } = useApp()

  const [countryCode, setCountryCode] = useState('+234')
  const [phone, setPhone] = useState(location.state?.phone || '812 345 6789')
  const [mode, setMode] = useState(location.state?.mode || 'register') // 'register' | 'signin'
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/onboarding/verify', { state: { phone, mode } })
    }, 600)
  }

  function handleFastSignIn() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Welcome back!', `Signed into ${user.name}'s verified account.`)
      navigate('/dashboard')
    }, 400)
  }

  return (
    <OnboardingShell
      footer={
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
          {trustPoints.map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" /> {t}
            </span>
          ))}
        </div>
      }
    >
      <div className="flex items-center justify-between mb-5">
        <span className="font-extrabold text-lg text-ink-900">Umepay</span>
        <StepBadge>{mode === 'signin' ? 'Sign In' : 'Step 1 of 2'}</StepBadge>
      </div>

      {/* Mode Switch Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`py-2 rounded-lg transition-all ${
            mode === 'register'
              ? 'bg-white text-ink-900 shadow-xs'
              : 'text-slate-500 hover:text-ink-800'
          }`}
        >
          Create Account
        </button>
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`py-2 rounded-lg transition-all ${
            mode === 'signin'
              ? 'bg-white text-ink-900 shadow-xs'
              : 'text-slate-500 hover:text-ink-800'
          }`}
        >
          Sign In
        </button>
      </div>

      <h1 className="text-2xl font-extrabold text-ink-900 tracking-tight">
        {mode === 'signin' ? 'Welcome back' : 'Enter your phone number'}
      </h1>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
        {mode === 'signin'
          ? 'Enter your registered phone number to receive a secure sign-in OTP.'
          : 'Your phone number is your financial identity. Connecting you to multi-currency cash networks instantly.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100 transition-colors">
          <CountryCodeDropdown
            value={countryCode}
            onChange={(val) => setCountryCode(val)}
          />
          <span className="h-5 w-px bg-slate-200" />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="numeric"
            placeholder="812 345 6789"
            className="flex-1 min-w-0 outline-none text-[15px] placeholder:text-slate-400 font-medium"
            required
          />
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          className="mt-5"
          loading={loading}
          icon={ArrowRight}
          iconPosition="right"
        >
          {mode === 'signin' ? 'Send Sign-In Code' : 'Continue to Verification'}
        </Button>
      </form>

      {/* Fast Sign In Access */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <button
          type="button"
          onClick={handleFastSignIn}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Sparkles size={14} className="text-amber-400" />
          <span>⚡ Fast Sign In ({user.name})</span>
        </button>
      </div>

      <p className="mt-4 text-xs text-center text-slate-400 leading-relaxed">
        By continuing, you agree to receive an SMS OTP for secure verification.
      </p>
    </OnboardingShell>
  )
}
