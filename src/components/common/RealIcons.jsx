import React from 'react'

// Authentic Umepay Brand Wordmark & Logo
export function UmepayLogo({ className = 'h-7', variant = 'dark' }) {
  const isLight = variant === 'light'
  const isYellow = variant === 'yellow'

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <svg viewBox="0 0 140 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
        {/* Custom modern Umepay typography */}
        <text
          x="0"
          y="29"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Inter', 'Outfit', sans-serif"
          fontWeight="800"
          fontSize="31"
          letterSpacing="-0.04em"
          fill={isYellow ? '#FFD000' : isLight ? '#FFFFFF' : '#0F172A'}
        >
          Umepay
        </text>
      </svg>
    </div>
  )
}

// Real Currency Badges & Icons
export function CurrencyBadge({ code, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-12 h-12 text-lg',
  }[size] || 'w-9 h-9 text-sm'

  switch (code?.toUpperCase()) {
    case 'USD':
      return (
        <div className={`${sizeClasses} rounded-full bg-[#0052FF] text-white flex items-center justify-center font-bold shrink-0 shadow-xs ${className}`}>
          $
        </div>
      )
    case 'NGN':
      return (
        <div className={`${sizeClasses} rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold shrink-0 shadow-xs ${className}`}>
          ₦
        </div>
      )
    case 'EUR':
      return (
        <div className={`${sizeClasses} rounded-full bg-[#C2410C] text-white flex items-center justify-center font-bold shrink-0 shadow-xs ${className}`}>
          €
        </div>
      )
    case 'GBP':
      return (
        <div className={`${sizeClasses} rounded-full bg-[#7E22CE] text-white flex items-center justify-center font-bold shrink-0 shadow-xs ${className}`}>
          £
        </div>
      )
    case 'BTC':
      return (
        <div className={`${sizeClasses} rounded-full bg-[#F7931A] text-white flex items-center justify-center font-bold shrink-0 shadow-xs ${className}`}>
          ₿
        </div>
      )
    case 'ETH':
      return (
        <div className={`${sizeClasses} rounded-full bg-[#627EEA] text-white flex items-center justify-center font-bold shrink-0 shadow-xs ${className}`}>
          Ξ
        </div>
      )
    case 'USDT':
      return (
        <div className={`${sizeClasses} rounded-full bg-[#26A17B] text-white flex items-center justify-center font-bold shrink-0 shadow-xs ${className}`}>
          ₮
        </div>
      )
    case 'USDC':
      return (
        <div className={`${sizeClasses} rounded-full bg-[#2775CA] text-white flex items-center justify-center font-bold shrink-0 shadow-xs ${className}`}>
          $
        </div>
      )
    default:
      return (
        <div className={`${sizeClasses} rounded-full bg-slate-800 text-white flex items-center justify-center font-bold shrink-0 shadow-xs ${className}`}>
          {code ? code.slice(0, 2) : '•'}
        </div>
      )
  }
}

// Real EMV Chip
export function CardChip({ className = 'w-10 h-7' }) {
  return (
    <div className={`${className} rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 border border-yellow-300/60 p-1 relative overflow-hidden shadow-inner`}>
      <div className="w-full h-full border border-amber-600/40 rounded-sm relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-amber-700/40 -translate-y-1/2" />
        <div className="absolute top-0 left-1/3 w-[1px] h-full bg-amber-700/40" />
        <div className="absolute top-0 right-1/3 w-[1px] h-full bg-amber-700/40" />
      </div>
    </div>
  )
}

// Visa & Mastercard SVGs
export function VisaLogo({ className = 'h-5' }) {
  return (
    <span className={`font-extrabold italic text-lg tracking-tighter text-white select-none ${className}`}>
      VISA
    </span>
  )
}

export function MastercardLogo({ className = 'h-6' }) {
  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      <div className="w-5 h-5 rounded-full bg-red-500/90 shadow-xs" />
      <div className="w-5 h-5 rounded-full bg-amber-400/90 shadow-xs" />
    </div>
  )
}
