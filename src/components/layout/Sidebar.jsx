import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CreditCard,
  Activity,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react'
import { UmepayLogo } from '../common/RealIcons.jsx'
import LogoutModal from '../common/LogoutModal.jsx'
import { useApp } from '../../context/AppContext.jsx'

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/send', label: 'Send', icon: ArrowUpRight },
  { to: '/receive', label: 'Receive', icon: ArrowDownLeft },
  { to: '/wallets', label: 'Wallets', icon: Wallet },
  { to: '/cards', label: 'Cards', icon: CreditCard },
  { to: '/history', label: 'History', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { user } = useApp()
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-slate-100 bg-white h-screen sticky top-0 px-4 py-6">
        <div>
          {/* Authentic Umepay Brand Wordmark */}
          <div className="flex items-center gap-2 px-3 mb-8">
            <UmepayLogo variant="dark" className="h-7" />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#0F172A] shadow-2xs'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          {/* Dynamic KYC Account Status Card */}
          {user.kycVerified ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 transition-colors">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs mb-1">
                <ShieldCheck size={16} />
                <span>Verified Account</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Full limits and all features unlocked.
              </p>
            </div>
          ) : (
            <Link
              to="/kyc"
              className="block rounded-2xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100/90 p-4 transition-all group shadow-xs cursor-pointer"
            >
              <div className="flex items-center justify-between gap-1 text-amber-800 font-bold text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert size={16} className="text-amber-600" />
                  <span>Unverified Account</span>
                </div>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-amber-700" />
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Complete KYC to unlock virtual cards &amp; full limits.
              </p>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 w-full transition-colors text-left cursor-pointer"
          >
            <LogOut size={18} strokeWidth={2} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  )
}
