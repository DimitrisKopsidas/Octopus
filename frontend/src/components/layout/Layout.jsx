// App shell: sticky header nav + Outlet + Footer + mobile drawer + toasts. Wraps every route.
import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../../assets/logo.png'
import MobileNavDrawer from './MobileNavDrawer'
import UserMenu from './UserMenu'
import Footer from './Footer'
import ToastContainer from '../ui/Toast'
import { useMe } from '../../hooks/queries'
import t from '../../content/layout.json'

const navLinkClass = ({ isActive }) =>
  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
    isActive
      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
      : 'text-brand-100 hover:bg-brand-800/80 hover:text-white'
  }`

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isLoading } = useMe()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="sticky top-0 bg-purple-900/95 dark:bg-purple-950/95 backdrop-blur-md border-b border-purple-800/60 shadow-lg z-30">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand / Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 text-white font-bold text-lg tracking-tight group shrink-0">
            <img src={logo} alt="Octopus" className="w-8 h-8 transition-transform group-hover:scale-105" />
            <span>{t.brand}</span>
          </NavLink>

          {/* Center: Navigation Links (Centered when logged in & out) */}
          <div className="hidden md:flex items-center justify-center gap-1 flex-1 mx-6">
            <NavLink to="/" end className={navLinkClass}>
              {t.nav.home}
            </NavLink>
            <NavLink to="/courses" className={navLinkClass}>
              {t.nav.courses}
            </NavLink>
            <NavLink to="/info" className={navLinkClass}>
              {t.nav.info}
            </NavLink>
          </div>

          {/* Right: User Menu or Login + Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-brand-800/80 animate-pulse border border-brand-700/50 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-brand-600/50" />
              </div>
            ) : user ? (
              <UserMenu />
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-500 shadow-md shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
              >
                {t.nav.login}
              </NavLink>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={t.mobile.menuLabel}
              className="md:hidden flex items-center justify-center p-2 rounded-lg text-brand-100 hover:bg-brand-800 hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      <MobileNavDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer />

      <ToastContainer />
    </div>
  )
}

export default Layout
