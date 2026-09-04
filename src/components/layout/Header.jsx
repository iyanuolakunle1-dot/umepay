import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react'
import NotificationsDropdown from './NotificationsDropdown.jsx'
import LogoutModal from '../common/LogoutModal.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function Header({ title }) {
  const { user } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const menuRef = useRef(null)

  const firstName = user.name.split(' ')[0]
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  // Greeting based on time of day
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  function handleLogoutClick() {
    setUserMenuOpen(false)
    setLogoutModalOpen(true)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [userMenuOpen])

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
      {/* Title / Mobile Greeting */}
      <div>
        {title === 'Dashboard' ? (
          <div>
            <p className="text-xs font-medium text-slate-400 sm:hidden">{greeting},</p>
            <h1 className="text-lg sm:text-2xl font-bold text-ink-900 tracking-tight truncate">
              <span className="sm:hidden">{firstName}</span>
              <span className="hidden sm:inline">Dashboard</span>
            </h1>
          </div>
        ) : (
          <h1 className="text-lg sm:text-2xl font-bold text-ink-900 tracking-tight truncate">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Desktop Search */}
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="h-10 w-64 rounded-xl bg-slate-50 border border-transparent focus:border-ink-200 focus:bg-white focus:ring-2 focus:ring-ink-100 pl-10 pr-4 text-sm outline-none transition-colors"
          />
        </div>

        <NotificationsDropdown />

        {/* User Profile & Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 sm:pl-3 sm:border-l sm:border-slate-100 text-left group hover:opacity-90 transition-opacity"
            title="Account menu"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover border border-slate-200 ring-2 ring-slate-100 shadow-xs shrink-0"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-ink-100 text-ink-700 grid place-items-center text-xs font-bold shrink-0">
                {initials}
              </div>
            )}
            <div className="leading-tight hidden sm:block">
              <p className="text-sm font-semibold text-ink-900 flex items-center gap-1">
                {user.name}
                <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
              </p>
              <p className="text-xs text-slate-400">{user.tier}</p>
            </div>
          </button>

          {/* User Popover Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white shadow-popover border border-slate-100 p-2 z-50 text-slate-800 animate-scale-in">
              <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-sm font-bold text-ink-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.phone}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{user.tier}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false)
                  navigate('/settings')
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-700 hover:text-ink-900 transition-colors text-left"
              >
                <User size={16} className="text-slate-500" />
                <span>Profile &amp; Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false)
                  navigate('/onboarding/kyc')
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-700 hover:text-ink-900 transition-colors text-left"
              >
                <ShieldCheck size={16} className="text-slate-500" />
                <span>KYC Verification</span>
              </button>

              <div className="h-px bg-slate-100 my-1" />

              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-rose-50 text-sm font-semibold text-rose-600 transition-colors text-left cursor-pointer"
              >
                <LogOut size={16} className="text-rose-500" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <LogoutModal open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} />
    </header>
  )
}
