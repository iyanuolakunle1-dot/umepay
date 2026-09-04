import { Bell } from 'lucide-react'
import Dropdown from '../ui/Dropdown.jsx'
import { useApp } from '../../context/AppContext.jsx'

export default function NotificationsDropdown() {
  const { notifications, unreadCount, markAllNotificationsRead } = useApp()

  return (
    <Dropdown
      align="right"
      trigger={
        <button
          aria-label="Notifications"
          className="relative h-10 w-10 grid place-items-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>
      }
    >
      {({ close }) => (
        <div className="w-80 max-w-[85vw]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h4 className="font-semibold text-ink-900 text-sm">Notifications</h4>
            <button
              onClick={() => {
                markAllNotificationsRead()
                close()
              }}
              className="text-xs font-semibold text-ink-500 hover:text-ink-800"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-2.5 px-4 py-3">
                <span
                  className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${
                    n.read ? 'bg-transparent' : 'bg-ink-600'
                  }`}
                />
                <p className="text-sm text-ink-700 leading-snug flex-1">{n.title}</p>
                <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                  {n.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Dropdown>
  )
}
