import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  History,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import LogoutModal from '../common/LogoutModal.jsx'
import { useApp } from '../../context/AppContext.jsx'

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/send', label: 'Send', icon: ArrowUpRight },
  { to: '/receive', label: 'Receive', icon: ArrowDownLeft },
  { to: '/wallets', label: 'Wallets', icon: CreditCard },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { user } = useApp()
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-slate-100 bg-white h-screen sticky top-0 px-4 py-6">
        <div>
          <div className="flex items-center gap-2.5 px-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-ink-800 grid place-items-center text-white font-bold text-sm">
              U
            </div>
            <span className="font-extrabold text-lg text-ink-900 tracking-tight">UMEPAY</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'bg-ink-50 text-ink-900'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-ink-800'
                  }`
                }
              >
                <item.icon size={18} strokeWidth={2.1} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          {user.kycVerified ? (
            <NavLink
              to="/settings"
              className="block rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 hover:bg-emerald-100/70 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm mb-1">
                <ShieldCheck size={16} />
                {user.tier || 'Tier 2 KYC Verified'}
              </div>
              <p className="text-xs text-emerald-600/90 leading-relaxed">
                Full limit: ${(user.dailySendLimit || 50000).toLocaleString()}.00 / day enabled.
              </p>
            </NavLink>
          ) : (
            <NavLink
              to="/onboarding/kyc"
              className="block rounded-2xl border border-gold-100 bg-gold-50 p-4 hover:bg-gold-100/70 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-gold-600 font-bold text-sm mb-1">
                <ShieldCheck size={16} />
                Verify Financial ID
              </div>
              <p className="text-xs text-gold-600/80 leading-relaxed">
                Complete KYC to unlock $50,000 daily limits &amp; features.
              </p>
            </NavLink>
          )}

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium text-rose-600 hover:bg-rose-50 w-full transition-colors text-left cursor-pointer"
          >
            <LogOut size={18} strokeWidth={2.1} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  )
}
