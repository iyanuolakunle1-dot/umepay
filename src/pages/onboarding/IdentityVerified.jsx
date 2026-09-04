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
      <div className="text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-50 grid place-items-center mx-auto mb-5">
          <Check size={28} className="text-emerald-600" strokeWidth={3} />
        </div>
        <h1 className="text-2xl font-extrabold text-ink-900 tracking-tight">Identity Verified</h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
          Your phone number +234 {phone} has been verified as your Universal Financial ID.
        </p>

        <div className="mt-7 space-y-3">
          <Button fullWidth size="lg" loading={loading} onClick={handleContinue}>
            Continue to KYC Verification
          </Button>

          <Button
            variant="outline"
            fullWidth
            size="lg"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </OnboardingShell>
  )
}
