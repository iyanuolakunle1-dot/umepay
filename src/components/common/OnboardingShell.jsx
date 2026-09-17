export default function OnboardingShell({ children, footer }) {
  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[460px] bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-10 animate-fade-in-up">
        {children}
      </div>
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  )
}

export function StepBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
      {children}
    </span>
  )
}
