import { NavLink } from 'react-router-dom'
import { ArrowUpRight, CreditCard, History, Home, User } from 'lucide-react'

const tabs = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/send', label: 'Send', icon: ArrowUpRight },
  { to: '/wallets', label: 'Assets', icon: CreditCard },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Profile', icon: User },
]

export default function MobileTabBar() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-[max(env(safe-area-inset-bottom),10px)]">
      <div className="flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all select-none ${
                isActive
                  ? 'text-ink-900 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-ink-50 text-ink-900' : 'text-slate-400'
                  }`}
                >
                  <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

