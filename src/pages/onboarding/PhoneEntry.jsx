import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import CountryCodeDropdown from '../../components/common/CountryCodeDropdown.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { authService } from '../../services/auth.service.js'

export default function PhoneEntry({ mode: modeProp }) {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const mode = modeProp || location.state?.mode || 'register'
  const [countryCode, setCountryCode] = useState('+234')
  const [phone, setPhone] = useState(location.state?.phone || '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const cleaned = phone.replace(/\s+/g, '')
    if (cleaned.length < 7) {
      toast.error('Invalid number', 'Please enter a valid phone number.')
      return
    }
    setLoading(true)
    try {
      await authService.resendOtp({ phone: `${countryCode}${cleaned}` })
    } catch (err) {
      console.warn('OTP request failed:', err.message)
    } finally {
      setLoading(false)
      navigate('/onboarding/verify', { state: { phone, countryCode, mode } })
    }
  }

  return (
    <div className="min-h-screen bg-white sm:bg-[#F4F7FB] flex flex-col sm:items-center sm:justify-center px-6 pt-14 pb-8 sm:px-4 sm:py-10">
      <div className="w-full sm:max-w-[480px] sm:bg-white sm:rounded-3xl sm:shadow-xl sm:border sm:border-slate-100 sm:p-10 flex flex-col flex-1 sm:flex-initial">

        <p className="text-center text-sm font-semibold text-slate-900 mb-10 sm:mb-6">
          Getting Started
        </p>

        <span className="inline-block self-start px-3 py-1 rounded-full text-xs font-bold tracking-wide text-amber-700 bg-amber-50 border border-amber-200 mb-4 uppercase">
          Universal ID
        </span>

        <h1 className="text-3xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-3">
          Enter your phone<br />number
        </h1>

        <p className="text-sm text-slate-500 leading-relaxed mb-8 sm:mb-6">
          Your phone number is your universal financial identity.
          Linking cash, cards, and stablecoins.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 sm:flex-initial">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Phone Number
          </label>

          <div className="flex items-center h-14 rounded-2xl border border-slate-200 px-4 gap-3 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-100 transition-colors bg-white">
            <CountryCodeDropdown
              value={countryCode}
              onChange={(val) => setCountryCode(val)}
            />
            <span className="h-6 w-px bg-slate-200" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="numeric"
              placeholder="812 345 6789"
              className="flex-1 min-w-0 outline-none text-[15px] placeholder:text-slate-400 font-medium text-slate-900"
              required
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span className="text-xs text-slate-500">
              Secured via state-level identity verification
            </span>
          </div>

          <div className="mt-auto pt-10 sm:mt-0 sm:pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#162044] hover:bg-[#1E293B] text-white font-bold text-sm tracking-wide transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
