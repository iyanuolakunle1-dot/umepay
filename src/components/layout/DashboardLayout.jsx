import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'
import MobileTabBar from './MobileTabBar.jsx'

export default function DashboardLayout({ title, children }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header title={title} />
        <main className="flex-1 px-4 sm:px-8 py-6 pb-24 lg:pb-10 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  )
}
