import React from 'react'
import { CardChip, VisaLogo } from '../common/RealIcons.jsx'
import { Radio, Wifi } from 'lucide-react'

export default function LandingVirtualCard() {
  return (
    <div className="relative w-full max-w-[420px] aspect-[1.586/1] rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden select-none flex flex-col justify-between bg-gradient-to-tr from-[#0038E2] via-[#0052FF] to-[#1E6BFF] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(0,82,255,0.35)] border border-blue-400/30">
      
      {/* Glossy ambient overlays */}
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-blue-900/40 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_60%)] pointer-events-none" />
      
      {/* Decorative Wave lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 400 250" fill="none">
        <path d="M-50 200 C 100 150, 200 280, 450 120" stroke="white" strokeWidth="2" />
        <path d="M-50 150 C 150 100, 250 220, 450 80" stroke="white" strokeWidth="1.5" />
      </svg>

      {/* Top Row: Umepay Brand & Contactless Icon */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-sm font-sans">
            Umepay
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi size={20} className="text-white/80 rotate-90" />
          <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-white/90">
            VIRTUAL
          </span>
        </div>
      </div>

      {/* Middle Row: Gold Chip & Card Number */}
      <div className="relative z-10 space-y-4 my-auto pt-2">
        <div className="flex items-center gap-3">
          <CardChip className="w-11 h-8 rounded-lg shadow-md" />
        </div>

        <div>
          <p className="font-mono text-xl sm:text-2xl font-bold tracking-[0.22em] text-white drop-shadow-sm">
            •••• &nbsp;•••• &nbsp;•••• &nbsp;0852
          </p>
        </div>
      </div>

      {/* Bottom Row: Cardholder & Visa Logo */}
      <div className="relative z-10 flex items-end justify-between pt-2">
        <div>
          <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-none mb-1">
            CARD HOLDER
          </p>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
            ALEXANDER COOPER
          </p>
        </div>

        <div className="text-right">
          <VisaLogo className="h-6 text-white drop-shadow-md" />
        </div>
      </div>
    </div>
  )
}
