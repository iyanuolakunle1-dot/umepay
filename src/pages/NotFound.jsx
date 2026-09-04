import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import Button from '../components/ui/Button.jsx'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-ink-800 text-white grid place-items-center font-extrabold text-2xl mb-6">
        U
      </div>
      <p className="text-6xl font-extrabold text-ink-900 tracking-tight">404</p>
      <h1 className="mt-3 text-xl font-bold text-ink-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-xs">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/dashboard" className="mt-7">
        <Button icon={Home}>Back to Dashboard</Button>
      </Link>
    </div>
  )
}
