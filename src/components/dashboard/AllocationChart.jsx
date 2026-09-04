export default function AllocationChart({ data }) {
  let cumulative = 0
  const stops = data
    .map((d) => {
      const start = cumulative
      cumulative += d.pct
      return `${d.color} ${start}% ${cumulative}%`
    })
    .join(', ')

  return (
    <div className="flex items-center gap-6">
      <div
        className="h-28 w-28 rounded-full shrink-0 grid place-items-center"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="h-16 w-16 rounded-full bg-white" />
      </div>
      <ul className="space-y-2.5">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-slate-500">
              {d.label} <span className="text-ink-900 font-semibold">({d.pct}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
