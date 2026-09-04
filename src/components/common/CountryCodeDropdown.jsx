import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

export const countryList = [
  { code: '+234', flag: '🇳🇬', country: 'Nigeria', iso: 'NG' },
  { code: '+1', flag: '🇺🇸', country: 'United States', iso: 'US' },
  { code: '+44', flag: '🇬🇧', country: 'United Kingdom', iso: 'GB' },
  { code: '+1', flag: '🇨🇦', country: 'Canada', iso: 'CA' },
  { code: '+49', flag: '🇩🇪', country: 'Germany', iso: 'DE' },
  { code: '+33', flag: '🇫🇷', country: 'France', iso: 'FR' },
  { code: '+233', flag: '🇬🇭', country: 'Ghana', iso: 'GH' },
  { code: '+254', flag: '🇰🇪', country: 'Kenya', iso: 'KE' },
  { code: '+27', flag: '🇿🇦', country: 'South Africa', iso: 'ZA' },
  { code: '+971', flag: '🇦🇪', country: 'UAE', iso: 'AE' },
  { code: '+61', flag: '🇦🇺', country: 'Australia', iso: 'AU' },
  { code: '+91', flag: '🇮🇳', country: 'India', iso: 'IN' },
  { code: '+81', flag: '🇯🇵', country: 'Japan', iso: 'JP' },
  { code: '+55', flag: '🇧🇷', country: 'Brazil', iso: 'BR' },
]

export default function CountryCodeDropdown({ value = '+234', onChange, className = '' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const dropdownRef = useRef(null)

  const selected =
    countryList.find((c) => c.code === value) || countryList[0]

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = countryList.filter(
    (c) =>
      c.country.toLowerCase().includes(query.toLowerCase()) ||
      c.code.includes(query) ||
      c.iso.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div ref={dropdownRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors cursor-pointer select-none"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span>{selected.code}</span>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-white shadow-popover border border-slate-100 p-2 z-50 text-slate-800 animate-scale-in">
          {/* Search box */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 mb-2">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code..."
              className="w-full bg-transparent text-xs font-semibold outline-none text-slate-800 placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
            {filtered.length === 0 ? (
              <p className="text-center py-3 text-xs text-slate-400">No countries found</p>
            ) : (
              filtered.map((c, i) => (
                <button
                  key={`${c.iso}-${c.code}-${i}`}
                  type="button"
                  onClick={() => {
                    onChange?.(c.code, c)
                    setOpen(false)
                    setQuery('')
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors text-left cursor-pointer ${
                    selected.iso === c.iso && selected.code === c.code
                      ? 'bg-ink-50 text-ink-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="truncate">{c.country}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-slate-400">{c.code}</span>
                    {selected.iso === c.iso && selected.code === c.code && (
                      <Check size={13} className="text-ink-900" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
