import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Flag,
  Users,
  KeyRound,
  ShieldCheck,
  Bug,
  Sliders,
  Shield,
} from 'lucide-react'
import { useMe } from '../../hooks/queries'
import { ROLE } from '../../lib/roles'

export default function PanelNavigation({ activeTab }) {
  const { user } = useMe()
  const location = useLocation()
  const currentPath = activeTab || location.pathname

  const isAdmin = user?.role === ROLE.ADMIN
  const isAdminSection = currentPath.startsWith('/admin-panel')

  // Control Panel sub-routes
  const isControlOverview = currentPath === '/control-panel'
  const isCourses = currentPath === '/control-panel/courses' || currentPath.startsWith('/control-panel/courses/')
  const isReports = currentPath === '/control-panel/reports'

  // Admin Panel sub-routes
  const isAdminOverview = currentPath === '/admin-panel'
  const isUsers = currentPath === '/admin-panel/users'
  const isInviteCodes = currentPath === '/admin-panel/invite-codes'
  const isAudits = currentPath === '/admin-panel/audits'
  const isCrashes = currentPath === '/admin-panel/crashes'

  const tabClass = (isActive) =>
    `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
      isActive
        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25 dark:bg-brand-500 dark:text-slate-950'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`

  return (
    <div className="mb-8 space-y-3">
      {/* Level 1: Context Switcher (Centered) */}
      <div className="flex items-center justify-center pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        {isAdmin ? (
          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 inline-flex items-center gap-1 shadow-inner">
            <Link
              to="/control-panel"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                !isAdminSection
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Περιεχόμενο</span>
            </Link>

            <Link
              to="/admin-panel"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isAdminSection
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Διαχείριση Συστήματος</span>
            </Link>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            <Sliders className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Πίνακας Ελέγχου</span>
          </div>
        )}
      </div>

      {/* Level 2: Section Sub-Navigation Tabs (Centered) */}
      <nav
        className="flex items-center justify-center gap-1.5 overflow-x-auto pb-1 text-sm no-scrollbar"
        aria-label="Υπο-ενότητες Διαχείρισης"
      >
        {!isAdminSection ? (
          /* Control Panel Tabs */
          <>
            <Link to="/control-panel" className={tabClass(isControlOverview)}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Επισκόπηση</span>
            </Link>
            <Link to="/control-panel/courses" className={tabClass(isCourses)}>
              <BookOpen className="w-4 h-4" />
              <span>Μαθήματα & Ερωτήσεις</span>
            </Link>
            <Link to="/control-panel/reports" className={tabClass(isReports)}>
              <Flag className="w-4 h-4" />
              <span>Αναφορές</span>
            </Link>
          </>
        ) : (
          /* Admin Panel Tabs */
          <>
            <Link to="/admin-panel" className={tabClass(isAdminOverview)}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Επισκόπηση Admin</span>
            </Link>
            <Link to="/admin-panel/users" className={tabClass(isUsers)}>
              <Users className="w-4 h-4" />
              <span>Χρήστες & Ρόλοι</span>
            </Link>
            <Link to="/admin-panel/invite-codes" className={tabClass(isInviteCodes)}>
              <KeyRound className="w-4 h-4" />
              <span>Invite Codes</span>
            </Link>
            <Link to="/admin-panel/audits" className={tabClass(isAudits)}>
              <ShieldCheck className="w-4 h-4" />
              <span>Audit Logs</span>
            </Link>
            <Link to="/admin-panel/crashes" className={tabClass(isCrashes)}>
              <Bug className="w-4 h-4" />
              <span>Crash Logs</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}
