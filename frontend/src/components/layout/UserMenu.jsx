// Logged-in user dropdown (avatar, profile, favorites, quizzes, settings, logout). Used by Layout.
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  User,
  Heart,
  FileCheck2,
  Settings,
  Sliders,
  Shield,
  LogOut,
} from 'lucide-react'
import { useMe, useLogout } from '../../hooks/queries'
import { ROLE, roleLabel, userInitial } from '../../lib/roles'
import ThemeToggle from './ThemeToggle'
import { toast } from '../../store/toastStore'
import { useNavigate } from 'react-router-dom'

function canManageContent(user) {
  return user?.role === ROLE.ADMIN || user?.role === ROLE.HELPER
}

function isAdmin(user) {
  return user?.role === ROLE.ADMIN
}

function UserMenu() {
  const navigate = useNavigate()
  const { user } = useMe()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const logoutMutation = useLogout()

  const handleLogout = async () => {
    setOpen(false)
    await logoutMutation.mutateAsync().catch(() => {})
    toast.success('Αποσυνδέθηκες επιτυχώς.')
    navigate('/login')
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    if (open) {
      document.addEventListener('click', handleOutsideClick)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  if (!user) return null

  const label = roleLabel(user)
  const initial = userInitial(user)

  return (
    <div className="relative ml-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md text-brand-100 hover:bg-brand-800 hover:text-white transition-colors cursor-pointer"
      >
        <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center justify-center shadow-sm">
          {initial}
        </span>
        <span className="hidden sm:inline text-sm font-medium max-w-[10rem] truncate">
          {user.displayName}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-reveal"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {user.displayName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              @{user.username} · <span className="text-brand-600 dark:text-brand-400 font-semibold">{label}</span>
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <span className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400" />
                <span>Το προφίλ μου</span>
              </span>
            </Link>

            <Link
              to="/favorites"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <span className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Αγαπημένα</span>
              </span>
            </Link>

            <Link
              to="/quizzes"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <span className="flex items-center gap-3">
                <FileCheck2 className="w-4 h-4 text-indigo-500" />
                <span>Τα Κουίζ μου</span>
              </span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <span className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Ρυθμίσεις</span>
              </span>
            </Link>

            {canManageContent(user) && (
              <Link
                to="/control-panel"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="flex items-center justify-between px-5 py-2.5 text-sm font-semibold text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors border-t border-slate-100 dark:border-slate-800"
              >
                <span className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-brand-600" />
                  <span>Πίνακας Ελέγχου</span>
                </span>
              </Link>
            )}

            {isAdmin(user) && (
              <Link
                to="/admin-panel"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="flex items-center justify-between px-5 py-2.5 text-sm font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Πίνακας Admin</span>
                </span>
              </Link>
            )}
          </div>

          {/* Quick Theme Toggle Row */}
          <div className="px-4 py-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Εμφάνιση</span>
            <ThemeToggle />
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            role="menuitem"
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-50 border-t border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{logoutMutation.isPending ? 'Αποσύνδεση…' : 'Αποσύνδεση'}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
