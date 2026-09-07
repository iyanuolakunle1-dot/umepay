import React from 'react'
import { ArrowUpRight, Check, CreditCard, Landmark, Smartphone, Wallet, Zap } from 'lucide-react'

export default function LandingHeroDiagram() {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Outer ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-amber-200/40 via-blue-200/30 to-purple-200/40 rounded-[40px] blur-2xl -z-10" />

      {/* Main Container Card */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-[32px] border border-slate-200/90 p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        {/* Central Hub and 4 Satellite Nodes Grid */}
        <div className="relative aspect-square max-w-[380px] mx-auto flex items-center justify-center">
          
          {/* Subtle connecting lines / crosshairs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-200" viewBox="0 0 380 380" fill="none">
            {/* Center concentric pulse circles */}
            <circle cx="190" cy="190" r="140" strokeDasharray="4 4" strokeWidth="1.5" className="stroke-slate-200" />
            <circle cx="190" cy="190" r="80" strokeWidth="1" className="stroke-amber-200" />
            
            {/* Connecting lines from center to 4 nodes */}
            <line x1="190" y1="190" x2="70" y2="70" strokeWidth="2" strokeDasharray="3 3" className="stroke-amber-300 animate-pulse" />
            <line x1="190" y1="190" x2="310" y2="70" strokeWidth="2" strokeDasharray="3 3" className="stroke-amber-300 animate-pulse" />
            <line x1="190" y1="190" x2="70" y2="310" strokeWidth="2" strokeDasharray="3 3" className="stroke-amber-300 animate-pulse" />
            <line x1="190" y1="190" x2="310" y2="310" strokeWidth="2" strokeDasharray="3 3" className="stroke-amber-300 animate-pulse" />
          </svg>

          {/* 1. Top-Left Satellite: Fiat Accounts */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 animate-fade-in">
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center gap-2.5 hover:scale-105 transition-transform duration-300">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shadow-xs">
                USD
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fiat Rails</p>
                <p className="text-xs font-extrabold text-slate-900">Fiat Accounts</p>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Instant FedNow
                </p>
              </div>
            </div>
          </div>

          {/* 2. Top-Right Satellite: Traditional Bank */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 animate-fade-in">
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center gap-2.5 hover:scale-105 transition-transform duration-300">
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                <Landmark size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Settlement</p>
                <p className="text-xs font-extrabold text-slate-900">Traditional Bank</p>
                <p className="text-[10px] text-slate-500 font-semibold">ACH &amp; SEPA</p>
              </div>
            </div>
          </div>

          {/* 3. Bottom-Left Satellite: Virtual Card */}
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 animate-fade-in">
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center gap-2.5 hover:scale-105 transition-transform duration-300">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                <CreditCard size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Card Suite</p>
                <p className="text-xs font-extrabold text-slate-900">Virtual Card</p>
                <p className="text-[10px] text-slate-500 font-semibold">Visa &amp; Apple Pay</p>
              </div>
            </div>
          </div>

          {/* 4. Bottom-Right Satellite: Crypto Assets */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10 animate-fade-in">
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center gap-2.5 hover:scale-105 transition-transform duration-300">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                <Wallet size={18} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Blockchain</p>
                <p className="text-xs font-extrabold text-slate-900">Crypto Assets</p>
                <p className="text-[10px] text-slate-500 font-semibold">USDT • BTC • ETH</p>
              </div>
            </div>
          </div>

          {/* CENTER HUB: Yellow Ring & Phone Identity */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute -inset-3 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full blur-md opacity-40 animate-pulse" />
            
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 p-1 shadow-xl flex flex-col items-center justify-center text-center text-slate-950">
              <div className="h-full w-full rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 flex flex-col items-center justify-center p-2 border-2 border-white/60">
                <div className="h-6 w-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-1">
                  <Smartphone size={13} className="text-slate-950 font-bold" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-900/80 leading-none">
                  UMEPAY ID
                </p>
                <p className="text-[11px] sm:text-xs font-extrabold text-slate-950 tracking-tight mt-0.5">
                  +1 (555) 019
                </p>
                <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wide bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded-full mt-1">
                  <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Transaction Pill */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">Universal Routing Active</span>
          </div>
          <span className="text-slate-400 font-medium text-[11px]">0.00s Settlement</span>
        </div>
      </div>
    </div>
  )
}
