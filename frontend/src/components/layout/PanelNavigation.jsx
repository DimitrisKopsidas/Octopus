import { Link, useLocation } from 'react-router-dom'
import { useMe } from '../../hooks/queries'
import { ROLE } from '../../lib/roles'

export default function PanelNavigation({ activeTab }) {
  const { user } = useMe()
  const location = useLocation()
  const currentPath = activeTab || location.pathname

  const isAdmin = user?.role === ROLE.ADMIN

  const isControlPanelActive = currentPath === '/control-panel'
  const isCoursesActive = currentPath === '/control-panel/courses' || currentPath.startsWith('/control-panel/courses/')
  const isReportsActive = currentPath === '/control-panel/reports'
  const isAdminPanelActive = currentPath === '/admin-panel'
  const isAuditsActive = currentPath === '/admin-panel/audits'

  return (
    <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-2" aria-label="Πλοήγηση Διαχείρισης">
          {/* Overview Control Panel */}
          <Link
            to="/control-panel"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isControlPanelActive
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>🛠️ Πίνακας Ελέγχου</span>
          </Link>

          {/* Courses & Questions */}
          <Link
            to="/control-panel/courses"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isCoursesActive
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>📚 Μαθήματα</span>
          </Link>

          {/* Reports & Feedback */}
          <Link
            to="/control-panel/reports"
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              isReportsActive
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>🚩 Αναφορές</span>
          </Link>

          {/* Admin Panel Tab (Admins only) */}
          {isAdmin && (
            <Link
              to="/admin-panel"
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isAdminPanelActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>👑 Πίνακας Admin</span>
            </Link>
          )}

          {/* Audit Logs Tab (Admins only) */}
          {isAdmin && (
            <Link
              to="/admin-panel/audits"
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isAuditsActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>📜 Audit Logs</span>
            </Link>
          )}
        </nav>

        {/* Current User Role Badge */}
        {user && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Χρήστης:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">@{user.username}</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                isAdmin
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/20'
              }`}
            >
              {user.role}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
