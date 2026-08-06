// Sliding mobile nav drawer + backdrop (owns body scroll-lock). Used by Layout.
import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import ThemeToggle from './ThemeToggle'
import { useMe, useLogout } from '../../hooks/queries'
import { canManageContent, userInitial } from '../../lib/roles'
import t from '../../content/layout.json'

const mobileNavLinkClass = ({ isActive }) =>
  `block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-brand-100 hover:bg-brand-800 hover:text-white'
  }`

// Sliding mobile navigation drawer + backdrop. Owns the body scroll-lock
// while open so the host layout stays free of that concern.
function MobileNavDrawer({ open, onClose }) {
  const navigate = useNavigate()
  const { user, isLoading } = useMe()
  const logoutMutation = useLogout()
  const showAdmin = canManageContent(user)

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [open])

  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
      />

      <div className="fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] bg-brand-900 dark:bg-brand-950 border-l border-brand-800 shadow-2xl z-50 md:hidden p-6 flex flex-col justify-between animate-slideInRight">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-brand-800">
            <span className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
              <img src={logo} alt="Octopus" className="w-7 h-7" />
              <span>{t.brand}</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.mobile.closeLabel}
              className="p-2 rounded-md text-brand-100 hover:bg-brand-800 hover:text-white transition-colors cursor-pointer"
            >
              <span className="text-xl leading-none">✕</span>
            </button>
          </div>

          <div className="space-y-2">
            <NavLink to="/" end onClick={onClose} className={mobileNavLinkClass}>{t.nav.home}</NavLink>
            <NavLink to="/courses" onClick={onClose} className={mobileNavLinkClass}>{t.nav.courses}</NavLink>
            <NavLink to="/info" onClick={onClose} className={mobileNavLinkClass}>{t.nav.info}</NavLink>
          </div>
        </div>

        <div className="border-t border-brand-800 pt-4">
          {isLoading ? (
            <div className="flex items-center gap-3 px-2 py-2 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-brand-800/80 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-24 bg-brand-800/80 rounded" />
                <div className="h-2.5 w-16 bg-brand-800/60 rounded" />
              </div>
            </div>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <span className="w-9 h-9 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center justify-center shrink-0">
                  {userInitial(user)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white leading-tight truncate">{user.displayName}</p>
                  <p className="text-xs text-brand-200 truncate">@{user.username}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={logoutMutation.isPending}
                onClick={async () => {
                  onClose()
                  await logoutMutation.mutateAsync().catch(() => {})
                  navigate('/')
                }}
                className="w-full mt-2 py-2 rounded-lg text-sm font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/20 hover:bg-rose-950/40 disabled:opacity-50 text-center transition-colors cursor-pointer"
              >
                {t.mobile.logout}
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <NavLink
                to="/login"
                onClick={onClose}
                className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-colors"
              >
                {t.nav.login}
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MobileNavDrawer
