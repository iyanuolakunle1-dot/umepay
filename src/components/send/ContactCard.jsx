import { User } from 'lucide-react'

export default function ContactCard({ contact, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(contact)}
      className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors ${
        selected ? 'border-ink-500 bg-ink-50' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
      }`}
    >
      <div
        className={`h-10 w-10 rounded-full grid place-items-center ${
          selected ? 'bg-ink-200 text-ink-700' : 'bg-slate-200 text-slate-500'
        }`}
      >
        <User size={18} />
      </div>
      <span className="text-sm font-semibold text-ink-900 truncate w-full">{contact.name}</span>
    </button>
  )
}
