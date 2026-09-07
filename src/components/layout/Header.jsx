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

export default function Header({ title }) {
  const { user } = useApp()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const menuRef = useRef(null)

  const firstName = user.name.split(' ')[0]
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')

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
      {/* Title / Page Name */}
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search Bar matching screenshot */}
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="h-10 w-64 sm:w-72 rounded-xl bg-slate-50 border border-slate-200/80 focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 pl-10 pr-4 text-xs font-medium outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <NotificationsDropdown />

        {/* User Profile Header matching screenshot */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 sm:pl-3 text-left group hover:opacity-90 transition-opacity cursor-pointer"
            title="Account menu"
          >
            <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-800 grid place-items-center text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">{user.tier}</p>
            </div>
          </button>

          {/* User Popover Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white shadow-xl border border-slate-100 p-2 z-50 text-slate-800 animate-scale-in">
              <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{user.tier}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false)
                  navigate('/settings')
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors text-left cursor-pointer"
              >
                <User size={15} className="text-slate-500" />
                <span>Profile &amp; Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false)
                  navigate('/cards')
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors text-left cursor-pointer"
              >
                <ShieldCheck size={15} className="text-slate-500" />
                <span>Virtual Cards</span>
              </button>

              <div className="h-px bg-slate-100 my-1" />

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false)
                  setLogoutModalOpen(true)
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors text-left cursor-pointer"
              >
                <LogOut size={15} className="text-rose-500" />
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
