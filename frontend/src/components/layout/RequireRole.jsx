// Route guard for content-management pages. Wraps restricted routes in main.jsx.
import { Link } from 'react-router-dom'
import { useMe } from '../../hooks/queries'
import { ROLE } from '../../lib/roles'
import Skeleton from '../ui/Skeleton'
import tAdmin from '../../content/admin.json'

function RequireRole({ children, allowedRoles = [ROLE.HELPER, ROLE.ADMIN] }) {
  const { user, isLoading } = useMe()

  if (isLoading) {
    return (
      <div role="status" aria-label="Έλεγχος πρόσβασης" className="max-w-2xl mx-auto py-12 space-y-4">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  const hasRole = user != null && allowedRoles.includes(user.role)

  if (!hasRole) {
    return <NoAccess loggedIn={user != null} allowedRoles={allowedRoles} />
  }

  return children
}

function NoAccess({ loggedIn, allowedRoles = [] }) {
  const isAdminOnly = allowedRoles.length === 1 && allowedRoles.includes(ROLE.ADMIN)

  const title = loggedIn
    ? 'Περιορισμένη Πρόσβαση'
    : 'Απαιτείται Σύνδεση για τον Πίνακα Helper'

  const message = loggedIn
    ? isAdminOnly
      ? 'Η πρόσβαση σε αυτή τη σελίδα είναι διαθέσιμη αποκλειστικά σε Διαχειριστές (Admin).'
      : 'Η διαχείριση περιεχομένου είναι διαθέσιμη μόνο σε Helpers & Admins.'
    : 'Συνδέσου στο λογαριασμό σου για να αποκτήσεις πρόσβαση στη διαχείριση μαθημάτων και την εισαγωγή ερωτήσεων.'

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 animate-fade-up">
      {/* Main Callout Card */}
      <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-3xl p-8 sm:p-10 text-center">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-500/10 dark:bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl pointer-events-none" />

        {/* Icon with animated pulse */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-2xl bg-brand-500/20 dark:bg-brand-400/20 animate-ping opacity-30" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-brand-50 dark:from-slate-800 dark:to-slate-900 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-inner">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-8">
          {message}
        </p>

        {/* Rich Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Σύνδεση / Εγγραφή</span>
              </Link>
              <Link
                to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-transparent border-1 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold text-sm transition-all transform hover:-translate-y-0.5"
              >
                <span>Πίσω στην Αρχική</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Επιστροφή στην Αρχική</span>
              </Link>
              <Link
                to="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
              >
                <span>Μαθήματα</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 3 Helper Preview Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Question Management */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 flex flex-col items-start transition-all hover:border-brand-500/40 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
            {tAdmin.features[0].title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {tAdmin.features[0].description}
          </p>
        </div>

        {/* Card 2: Reports & Feedback */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 flex flex-col items-start transition-all hover:border-amber-500/40 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-500 flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
            {tAdmin.features[1].title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {tAdmin.features[1].description}
          </p>
        </div>

        {/* Card 3: Overview */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 flex flex-col items-start transition-all hover:border-purple-500/40 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/60 text-purple-500 flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
            {tAdmin.features[2].title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {tAdmin.features[2].description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RequireRole
