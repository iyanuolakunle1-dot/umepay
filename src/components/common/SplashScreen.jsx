import { useEffect, useState } from 'react'
import { Check, ShieldCheck, Sparkles } from 'lucide-react'

export default function SplashScreen({ onFinish, duration = 4000 }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100)
      setProgress(pct)

      if (elapsed >= duration - 400 && !fadeOut) {
        setFadeOut(true)
      }

      if (elapsed >= duration) {
        clearInterval(interval)
        setTimeout(() => {
          onFinish?.()
        }, 300)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [duration, fadeOut, onFinish])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1120] text-white select-none transition-all duration-700 ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(43,89,255,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#2b59ff]/30 via-emerald-500/20 to-amber-500/30 blur-xl animate-pulse duration-1000" />
          
          {/* Rotating Subtle Border */}
          <div className="absolute -inset-2 rounded-3xl border border-white/10 animate-spin duration-[6000ms]" />

          {/* Logo Box */}
          <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-[#18224b] to-[#0A0F24] p-0.5 shadow-2xl border border-white/20 flex items-center justify-center">
            <div className="h-full w-full rounded-2xl bg-[#0f172a] flex items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tighter bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                U
              </span>
            </div>
            {/* Live Indicator Dot */}
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-4 ring-[#0B1120] shadow-[0_0_10px_#34d399]" />
          </div>
        </div>

        {/* Wordmark */}
        <div className="space-y-1.5 mb-8">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black text-white tracking-tight">UMEPAY</h1>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#2b59ff]/20 text-[#60a5fa] border border-[#2b59ff]/30 tracking-widest">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Your Phone Number is Your Financial Identity
          </p>
        </div>

        {/* High-Precision Progress Bar */}
        <div className="w-64 space-y-2">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2b59ff] via-[#60a5fa] to-emerald-400 transition-all duration-75 ease-out shadow-[0_0_12px_#3b82f6]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles size={11} className="text-amber-400" /> Connecting Rails
            </span>
            <span className="text-white">{progress}%</span>
          </div>
        </div>

        {/* Regulatory Stamp */}
        <div className="mt-12 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Multi-Asset Atomic Settlement Protocol</span>
        </div>
      </div>
    </div>
  )
}
