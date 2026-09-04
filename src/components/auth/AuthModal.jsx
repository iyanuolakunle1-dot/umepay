import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import Modal, { ModalHeader } from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import CountryCodeDropdown from '../common/CountryCodeDropdown.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function AuthModal({ open, onClose, defaultTab = 'login', defaultPhone = '' }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, updateUser } = useApp()

  const [tab, setTab] = useState(defaultTab)
  const [countryCode, setCountryCode] = useState('+234')
  const [phone, setPhone] = useState(defaultPhone || '812 345 6789')
  const [email, setEmail] = useState('adaeze.okafor@gmail.com')
  const [firstName, setFirstName] = useState('Alexander')
  const [lastName, setLastName] = useState('Cooper')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setTab(defaultTab)
      if (defaultPhone) setPhone(defaultPhone)
    }
  }, [open, defaultTab, defaultPhone])

  function handleLoginSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onClose()
      toast.success('Welcome back!', `Signed in as ${user.name}.`)
      navigate('/dashboard')
    }, 600)
  }

  function handleRegisterSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const fullName = `${firstName} ${lastName}`.trim()
      updateUser({
        name: fullName || 'Alexander Cooper',
        email,
        phone: `+234 ${phone}`,
        avatarInitials: `${firstName?.[0] || 'A'}${lastName?.[0] || 'C'}`,
      })
      onClose()
      toast.success('Account Created', 'Enter verification code.')
      navigate('/onboarding/verify', { state: { phone, mode: 'register' } })
    }, 600)
  }

  function handleFastLogin() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onClose()
      toast.success('Welcome back!', `Signed in as ${user.name} (Verified Account).`)
      navigate('/dashboard')
    }, 400)
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="p-6 sm:p-7">
        {/* Header with Close */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#18224b] text-white font-extrabold text-sm grid place-items-center">
              U
            </div>
            <span className="font-extrabold text-lg text-ink-900 tracking-tight">UMEPAY</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-2.5 rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-white text-ink-900 shadow-xs'
                : 'text-slate-500 hover:text-ink-800'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-2.5 rounded-lg transition-all ${
              tab === 'register'
                ? 'bg-white text-ink-900 shadow-xs'
                : 'text-slate-500 hover:text-ink-800'
            }`}
          >
            Register
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                Phone Number / Universal ID
              </label>
              <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100">
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
                  className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-900">
                  Security PIN / Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    navigate('/onboarding/verify', { state: { phone, mode: 'signin' } })
                  }}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  Log in with OTP
                </button>
              </div>
              <div className="flex items-center h-12 rounded-xl border border-slate-200 px-3 gap-2.5 focus-within:border-ink-800 focus-within:ring-2 focus-within:ring-ink-100">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none"
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

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
              className="mt-2 shadow-sm"
            >
              Log In to Dashboard
            </Button>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleFastLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>⚡ Fast Sign In ({user.name})</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alexander"
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-ink-900 outline-none focus:border-ink-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Cooper"
                  className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-ink-900 outline-none focus:border-ink-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                Phone Number (Universal ID)
              </label>
              <div className="flex items-center h-11 rounded-xl border border-slate-200 px-3 gap-2 focus-within:border-ink-800">
                <CountryCodeDropdown
                  value={countryCode}
                  onChange={(val) => setCountryCode(val)}
                />
                <span className="h-4 w-px bg-slate-200" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="812 345 6789"
                  className="w-full bg-transparent text-sm font-semibold text-ink-900 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-900 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alexander@example.com"
                className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-ink-900 outline-none focus:border-ink-800"
                required
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
              className="mt-2 shadow-sm"
            >
              Create Universal Account
            </Button>
          </form>
        )}
      </div>
    </Modal>
  )
}
