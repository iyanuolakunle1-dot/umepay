export default function OnboardingShell({ children, footer }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-popover p-8 sm:p-9 animate-fade-in-up">
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
