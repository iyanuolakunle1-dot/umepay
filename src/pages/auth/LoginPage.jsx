import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import CountryCodeDropdown from '../../components/common/CountryCodeDropdown.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, updateUser } = useApp()

  const [loginMethod, setLoginMethod] = useState('phone') // 'phone' | 'email'
  const [countryCode, setCountryCode] = useState('+234')
  const [phone, setPhone] = useState('812 345 6789')
  const [email, setEmail] = useState('adaeze.okafor@gmail.com')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Welcome back!', `Signed in as ${user.name}.`)
      navigate('/dashboard')
    }, 700)
  }

  function handleQuickSignIn() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Welcome back!', `Signed in as ${user.name} (Verified Account).`)
      navigate('/dashboard')
    }, 400)
  }

  function handleOtpLogin() {
    navigate('/onboarding/verify', { state: { phone, mode: 'signin' } })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="h-10 w-10 rounded-xl bg-[#18224b] text-white font-black text-base grid place-items-center shadow-md group-hover:scale-105 transition-transform">
            U
          </div>
          <span className="font-extrabold text-2xl text-ink-900 tracking-tight">UMEPAY</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 tracking-tight">
          Log in to your account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your registered credentials or sign in with instant OTP.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-popover rounded-3xl border border-slate-100">
          {/* Login Type Switch */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-ink-900 shadow-xs'
                  : 'text-slate-500 hover:text-ink-800'
              }`}
            >
              <Phone size={14} /> Phone Number
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-ink-900 shadow-xs'
                  : 'text-slate-500 hover:text-ink-800'
              }`}
            >
              <Mail size={14} /> Email Address
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMethod === 'phone' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                  Phone Number
                </label>
                <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100 transition-all">
                  <CountryCodeDropdown
                    value={countryCode}
                    onChange={(val) => setCountryCode(val)}
                  />
                  <span className="h-5 w-px bg-slate-200" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="812 345 6789"
                    className="flex-1 min-w-0 outline-none text-sm font-semibold text-ink-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100 transition-all">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 min-w-0 outline-none text-sm font-semibold text-ink-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-900">
                  Security PIN / Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.info('Reset Link Sent', 'Check your phone/email for PIN reset.')}
                  className="text-xs font-semibold text-ink-700 hover:text-ink-900 hover:underline"
                >
                  Forgot PIN?
                </button>
              </div>

              <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100 transition-all">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 min-w-0 outline-none text-sm font-semibold text-ink-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-ink-800 focus:ring-ink-800"
                />
                <span>Remember this device</span>
              </label>

              <button
                type="button"
                onClick={handleOtpLogin}
                className="text-xs font-bold text-amber-600 hover:text-amber-700"
              >
                Log in via OTP SMS
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
              className="mt-2"
            >
              Log In to UMEPAY
            </Button>
          </form>

          {/* Quick Sign In Option */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleQuickSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles size={15} className="text-amber-400" />
              <span>⚡ Fast Sign In ({user.name})</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have a UMEPAY account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-ink-900 hover:underline underline-offset-2"
            >
              Register / Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
