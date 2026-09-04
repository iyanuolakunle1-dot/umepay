export default function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-card p-5 ${className}`}>
      <Skeleton className="h-4 w-24 rounded mb-4" />
      <Skeleton className="h-7 w-32 rounded mb-2" />
      <Skeleton className="h-3 w-20 rounded" />
    </div>
  )
}

export function SkeletonRow({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3 rounded" />
        <Skeleton className="h-2.5 w-1/4 rounded" />
      </div>
      <Skeleton className="h-3 w-14 rounded" />
    </div>
  )
}
