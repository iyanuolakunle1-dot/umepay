import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'

export default function IdentityVerified() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const phone = location.state?.phone || '812 345 6789'
  const countryCode = location.state?.countryCode || '+234'

  function handleContinue() {
    setLoading(true)
    setTimeout(() => navigate('/onboarding/kyc'), 600)
  }

  return (
    <div className="min-h-screen bg-white sm:bg-[#F4F7FB] flex flex-col items-center justify-center px-6 py-10 sm:px-4">
      <div className="w-full max-w-[420px] sm:bg-white sm:rounded-3xl sm:shadow-xl sm:border sm:border-slate-100 sm:p-10 text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-50 grid place-items-center mx-auto mb-6">
          <Check size={30} className="text-emerald-500" strokeWidth={3} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
          Identity Verified
        </h1>

        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto mb-8">
          Your phone number {countryCode} {phone} has been verified as your Universal Financial ID.
        </p>

        <button
          type="button"
          disabled={loading}
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-[#162044] hover:bg-[#1E293B] text-white font-bold text-sm tracking-wide transition-colors disabled:opacity-50"
        >
          {loading ? 'Continuing...' : 'Continue to KYC'}
        </button>
      </div>
    </div>
  )
}
