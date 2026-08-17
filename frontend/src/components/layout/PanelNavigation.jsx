import { Link, useLocation } from 'react-router-dom'
import { useMe } from '../../hooks/queries'
import { ROLE } from '../../lib/roles'

// Clean SVG Icons
function IconDashboard({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function IconBook({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function IconFlag({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  )
}

function IconUsers({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function IconKey({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  )
}

function IconShield({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function IconBug({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

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
              <span>🛠️ Περιεχόμενο</span>
            </Link>

            <Link
              to="/admin-panel"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isAdminSection
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <span>👑 Διαχείριση Συστήματος</span>
            </Link>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            <span>🛠️ Πίνακας Ελέγχου</span>
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
              <IconDashboard />
              <span>Επισκόπηση</span>
            </Link>
            <Link to="/control-panel/courses" className={tabClass(isCourses)}>
              <IconBook />
              <span>Μαθήματα & Ερωτήσεις</span>
            </Link>
            <Link to="/control-panel/reports" className={tabClass(isReports)}>
              <IconFlag />
              <span>Αναφορές</span>
            </Link>
          </>
        ) : (
          /* Admin Panel Tabs */
          <>
            <Link to="/admin-panel" className={tabClass(isAdminOverview)}>
              <IconDashboard />
              <span>Επισκόπηση Admin</span>
            </Link>
            <Link to="/admin-panel/users" className={tabClass(isUsers)}>
              <IconUsers />
              <span>Χρήστες & Ρόλοι</span>
            </Link>
            <Link to="/admin-panel/invite-codes" className={tabClass(isInviteCodes)}>
              <IconKey />
              <span>Invite Codes</span>
            </Link>
            <Link to="/admin-panel/audits" className={tabClass(isAudits)}>
              <IconShield />
              <span>Audit Logs</span>
            </Link>
            <Link to="/admin-panel/crashes" className={tabClass(isCrashes)}>
              <IconBug />
              <span>Crash Logs</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}
