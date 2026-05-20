import { NavLink, Outlet } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-brand-100 hover:bg-brand-800 hover:text-white'
  }`

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="bg-brand-900 dark:bg-brand-950 shadow-lg">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
            <span className="text-2xl">🐙</span>
            <span>Octopus</span>
          </NavLink>
          <div className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>Αρχική</NavLink>
            <NavLink to="/courses" className={navLinkClass}>Μαθήματα</NavLink>
            <NavLink to="/admin" className={navLinkClass}>Διαχείριση</NavLink>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Octopus · εξάσκηση πανεπιστημιακών μαθημάτων
      </footer>
    </div>
  )
}

export default Layout
