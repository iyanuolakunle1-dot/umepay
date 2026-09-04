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
  User,
} from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import CountryCodeDropdown from '../../components/common/CountryCodeDropdown.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { updateUser } = useApp()

  const [countryCode, setCountryCode] = useState('+234')
  const [formData, setFormData] = useState({
    firstName: 'Alexander',
    lastName: 'Cooper',
    email: 'alexander.cooper@gmail.com',
    phone: '812 345 6789',
    pin: '1234',
    referralCode: '',
  })
  const [showPin, setShowPin] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [loading, setLoading] = useState(false)

  function handleChange(field, val) {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  function handleRegister(e) {
    e.preventDefault()
    if (!agreeTerms) {
      toast.error('Terms Required', 'Please accept the Terms of Service to continue.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      updateUser({
        name: fullName || 'Alexander Cooper',
        email: formData.email,
        phone: `+234 ${formData.phone}`,
        avatarInitials: `${formData.firstName?.[0] || 'A'}${formData.lastName?.[0] || 'C'}`,
      })
      toast.success('Account Created!', 'Verification code sent to your phone.')
      navigate('/onboarding/verify', {
        state: { phone: formData.phone, mode: 'register' },
      })
    }, 700)
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
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Get your Universal Financial ID in less than 2 minutes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-popover rounded-3xl border border-slate-100">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                  First Name
                </label>
                <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100 transition-all">
                  <User size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Alexander"
                    className="flex-1 min-w-0 outline-none text-sm font-semibold text-ink-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                  Last Name
                </label>
                <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100 transition-all">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Cooper"
                    className="flex-1 min-w-0 outline-none text-sm font-semibold text-ink-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                Phone Number (Universal ID)
              </label>
              <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100 transition-all">
                <CountryCodeDropdown
                  value={countryCode}
                  onChange={(val) => setCountryCode(val)}
                />
                <span className="h-5 w-px bg-slate-200" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="812 345 6789"
                  className="flex-1 min-w-0 outline-none text-sm font-semibold text-ink-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100 transition-all">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="alexander@example.com"
                  className="flex-1 min-w-0 outline-none text-sm font-semibold text-ink-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                Create Security PIN / Password
              </label>
              <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100 transition-all">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={formData.pin}
                  onChange={(e) => handleChange('pin', e.target.value)}
                  placeholder="••••"
                  maxLength={6}
                  className="flex-1 min-w-0 outline-none text-sm font-semibold text-ink-900 placeholder:text-slate-400 font-mono tracking-wider"
                  required
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

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-ink-800 focus:ring-ink-800"
                />
                <span className="leading-relaxed">
                  I agree to UMEPAY's <a href="#" className="font-bold text-ink-900 hover:underline">Terms of Service</a>,{' '}
                  <a href="#" className="font-bold text-ink-900 hover:underline">Privacy Policy</a>, and electronic disclosures.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
              className="mt-4"
            >
              Create Account &amp; Continue
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered on UMEPAY?{' '}
            <Link
              to="/login"
              className="font-bold text-ink-900 hover:underline underline-offset-2"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
