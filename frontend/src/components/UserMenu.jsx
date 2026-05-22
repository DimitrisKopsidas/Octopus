import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function UserMenu() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) return null

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  const roleLabel = user.role === 'helper' ? 'Helper' : 'Φοιτητής'
  const initial = user.displayName.trim().charAt(0).toUpperCase() || '?'

  return (
    <div className="relative ml-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md text-brand-100 hover:bg-brand-800 hover:text-white transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center justify-center">
          {initial}
        </span>
        <span className="hidden sm:inline text-sm font-medium max-w-[10rem] truncate">
          {user.displayName}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user.displayName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              @{user.username} · {roleLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            role="menuitem"
            className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            Αποσύνδεση
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
