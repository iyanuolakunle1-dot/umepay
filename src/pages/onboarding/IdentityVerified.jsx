import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import OnboardingShell from '../../components/common/OnboardingShell.jsx'
import Button from '../../components/ui/Button.jsx'

export default function IdentityVerified() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const phone = location.state?.phone || '812 345 6789'

  function handleContinue() {
    setLoading(true)
    setTimeout(() => navigate('/onboarding/kyc'), 600)
  }

  return (
    <OnboardingShell>
      <div className="text-center py-2">
        <div className="h-14 w-14 rounded-full bg-emerald-50 grid place-items-center mx-auto mb-4">
          <Check size={26} className="text-emerald-500" strokeWidth={3} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Identity Verified</h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto mb-6">
          Your phone number +234 {phone} has been verified as your Universal Financial ID.
        </p>

        <button
          type="button"
          disabled={loading}
          onClick={handleContinue}
          className="w-full py-3.5 rounded-xl bg-[#162044] hover:bg-[#1E293B] text-white font-bold text-sm tracking-wide transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          {loading ? 'Continuing...' : 'Continue to KYC'}
        </button>
      </div>
    </OnboardingShell>
  )
}
