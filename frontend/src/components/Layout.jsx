import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'
import { useAuthStore } from '../store/authStore'

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-brand-100 hover:bg-brand-800 hover:text-white'
  }`

const mobileNavLinkClass = ({ isActive }) =>
  `block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-brand-100 hover:bg-brand-800 hover:text-white'
  }`

function Layout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  // Scroll lock when mobile navigation drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [mobileMenuOpen])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="sticky top-0 bg-brand-900/95 dark:bg-brand-950/95 backdrop-blur-md shadow-lg z-30">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
            <span className="text-2xl">🐙</span>
            <span>Octopus</span>
          </NavLink>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>Αρχική</NavLink>
            <NavLink to="/courses" className={navLinkClass}>Μαθήματα</NavLink>
            <NavLink to="/admin" className={navLinkClass}>Διαχείριση</NavLink>
            <ThemeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <NavLink
                to="/login"
                className="ml-1 px-3 py-2 rounded-md text-sm font-medium bg-brand-600 text-white hover:bg-brand-500 transition-colors"
              >
                Σύνδεση
              </NavLink>
            )}
          </div>

          {/* Hamburger button for mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Μενού πλοήγησης"
            className="md:hidden flex items-center justify-center p-2 rounded-md text-brand-100 hover:bg-brand-800 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-xl leading-none">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </nav>
      </header>

      {/* Mobile Navigation Sidebar Drawer (Slides in from the right) - Rendered OUTSIDE header to prevent backdrop-blur leakage */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            onClick={closeMenu}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          />

          {/* Sidebar drawer container */}
          <div className="fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] bg-brand-900 dark:bg-brand-950 border-l border-brand-800 shadow-2xl z-50 md:hidden p-6 flex flex-col justify-between animate-slideInRight">
            
            <div className="space-y-6">
              {/* Header of Drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-800">
                <span className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
                  <span className="text-2xl">🐙</span>
                  <span>Octopus</span>
                </span>
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Κλείσιμο μενού"
                  className="p-2 rounded-md text-brand-100 hover:bg-brand-800 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-xl leading-none">✕</span>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                <NavLink to="/" end onClick={closeMenu} className={mobileNavLinkClass}>Αρχική</NavLink>
                <NavLink to="/courses" onClick={closeMenu} className={mobileNavLinkClass}>Μαθήματα</NavLink>
                <NavLink to="/admin" onClick={closeMenu} className={mobileNavLinkClass}>Διαχείριση</NavLink>
              </div>

              {/* Theme Toggle row */}
              <div className="flex items-center justify-between px-4 py-2 text-brand-100 text-sm font-semibold rounded-lg hover:bg-brand-800 transition-colors">
                <span>Θέμα</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Bottom Auth block */}
            <div className="border-t border-brand-800 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <span className="w-9 h-9 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center justify-center shrink-0">
                      {user.displayName.trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white leading-tight truncate">{user.displayName}</p>
                      <p className="text-xs text-brand-200 truncate">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu()
                      logout()
                    }}
                    className="w-full mt-2 py-2 rounded-lg text-sm font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/20 hover:bg-rose-950/40 text-center transition-colors cursor-pointer"
                  >
                    Αποσύνδεση
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-colors"
                  >
                    Σύνδεση
                  </NavLink>
                </div>
              )}
            </div>

          </div>
        </>
      )}

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
