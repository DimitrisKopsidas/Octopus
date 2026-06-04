// App shell: sticky header nav + Outlet + Footer + mobile drawer + toasts. Wraps every route.
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import logo from '../../assets/logo.png'
import ThemeToggle from './ThemeToggle'
import MobileNavDrawer from './MobileNavDrawer'
import Footer from './Footer'
import ToastContainer from '../ui/Toast'
import t from '../../content/layout.json'

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-brand-100 hover:bg-brand-800 hover:text-white'
  }`

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="sticky top-0 bg-brand-900/95 dark:bg-brand-950/95 backdrop-blur-md shadow-lg z-30">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
            <img src={logo} alt="Octopus" className="w-7 h-7" />
            <span>{t.brand}</span>
          </NavLink>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>{t.nav.home}</NavLink>
            <NavLink to="/courses" className={navLinkClass}>{t.nav.courses}</NavLink>
            {/* <NavLink to="/admin" className={navLinkClass}>{t.nav.admin}</NavLink> */}
            <NavLink to="/info" className={navLinkClass}>{t.nav.info}</NavLink>
            <ThemeToggle />
            {/* {user ? (
              <UserMenu />
            ) : (
              <NavLink
                to="/login"
                className="ml-1 px-3 py-2 rounded-md text-sm font-medium bg-brand-600 text-white hover:bg-brand-500 transition-colors"
              >
                {t.nav.login}
              </NavLink>
            )} */}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={t.mobile.menuLabel}
            className="md:hidden flex items-center justify-center p-2 rounded-md text-brand-100 hover:bg-brand-800 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-xl leading-none">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
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
