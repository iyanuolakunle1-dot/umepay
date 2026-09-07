import React from 'react'
import { UmepayLogo } from '../common/RealIcons.jsx'

export default function VirtualCardVisual({
  label = 'NETFLIX & SUBSCRIPTIONS',
  last4 = '4821',
  fullNumber = '',
  showNumber = false,
  holder = 'ALEXANDER COOPER',
  expiry = '09/28',
  currency = 'USD',
  colorScheme = 'blue',
  className = '',
}) {
  // Gradients matching exact screenshots
  const bgStyles = {
    blue: 'bg-gradient-to-tr from-[#0038E2] via-[#0052FF] to-[#0A65FF]',
    navy: 'bg-gradient-to-tr from-[#090D16] via-[#111827] to-[#1F2937]',
    gold: 'bg-gradient-to-tr from-[#B45309] via-[#D97706] to-[#F59E0B]',
    purple: 'bg-gradient-to-tr from-[#4C1D95] via-[#6D28D9] to-[#7C3AED]',
  }[colorScheme] || (
    currency === 'NGN'
      ? 'bg-gradient-to-tr from-[#090D16] via-[#111827] to-[#1F2937]'
      : currency === 'EUR'
      ? 'bg-gradient-to-tr from-[#B45309] via-[#D97706] to-[#F59E0B]'
      : currency === 'GBP'
      ? 'bg-gradient-to-tr from-[#4C1D95] via-[#6D28D9] to-[#7C3AED]'
      : 'bg-gradient-to-tr from-[#0038E2] via-[#0052FF] to-[#0A65FF]'
  )

  const formattedNumber = showNumber && fullNumber
    ? fullNumber
    : `•••• •••• •••• ${last4 || '4821'}`

  return (
    <div
      className={`relative aspect-[1.586/1] w-full max-w-[380px] rounded-2xl p-5 sm:p-6 text-white shadow-xl overflow-hidden select-none flex flex-col justify-between ${bgStyles} ${className}`}
      style={{
        boxShadow: '0 20px 25px -5px rgba(0, 50, 150, 0.15), 0 8px 10px -6px rgba(0, 50, 150, 0.1)',
      }}
    >
      {/* Glossy ambient overlay curve */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-black/15 blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

      {/* Top Bar: Umepay Logo in Gold + VIRTUAL badge */}
      <div className="relative z-10 flex items-center justify-between">
        <UmepayLogo variant="yellow" className="h-6" />
        <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase text-white/90">
          VIRTUAL
        </span>
      </div>

      {/* Middle: Card Label & Number */}
      <div className="relative z-10 my-auto pt-2">
        <p className="text-[11px] font-semibold tracking-wider text-white/80 uppercase mb-1 truncate">
          {label || 'CARD LABEL'}
        </p>
        <p className="font-mono text-xl sm:text-2xl font-bold tracking-[0.18em] text-white drop-shadow-sm">
          {formattedNumber}
        </p>
      </div>

      {/* Bottom: Card Holder, Expiry & Currency */}
      <div className="relative z-10 flex items-end justify-between pt-2 text-[11px] font-semibold tracking-wider text-white/90">
        <div>
          <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-none mb-1">
            CARD HOLDER
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-white truncate max-w-[170px]">
            {holder || 'ALEXANDER COOPER'}
          </p>
        </div>

        <div className="text-center">
          <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-none mb-1">
            EXPIRES
          </p>
          <p className="text-xs font-bold tracking-wider text-white">
            {expiry || '09/28'}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-black tracking-wider text-white">
            {currency || 'USD'}
          </p>
        </div>
      </div>
    </div>
  )
}
