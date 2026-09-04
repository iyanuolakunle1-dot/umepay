export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-slate-100 grid place-items-center mb-4 text-slate-400">
          <Icon size={22} />
        </div>
      )}
      <p className="font-semibold text-ink-900 text-sm">{title}</p>
      {description && <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
