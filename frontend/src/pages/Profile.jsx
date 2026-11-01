// Profile page. Route: /profile (own). Others live at /profile/:username (PublicProfile).
import { Link, useNavigate } from 'react-router-dom'
import { useMe, useLogout, usePublicProfile } from '../hooks/queries'
import { toast } from '../store/toastStore'
import ErrorState from '../components/ui/ErrorState'
import ProfileView, { ProfileViewSkeleton } from '../components/profile/ProfileView'
import t from '../content/profile.json'

function Profile() {
  const navigate = useNavigate()
  const { user, isLoading } = useMe()
  const logoutMutation = useLogout()
  // Stats and badges come from the public profile of our own username.
  const profileQuery = usePublicProfile(user?.username)

  async function handleLogout() {
    await logoutMutation.mutateAsync().catch(() => { })
    toast.success('Αποσυνδέθηκες επιτυχώς.')
    navigate('/login')
  }

  if (isLoading) {
    return <ProfileViewSkeleton />
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-8">
        {/* Main Logged-Out Callout Card */}
        <div className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-3xl p-8 sm:p-10 text-center animate-fade-up">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-500/10 dark:bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-teal-500/10 dark:bg-teal-500/20 blur-3xl pointer-events-none" />

          {/* Icon with animated pulse */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-2xl bg-brand-500/20 dark:bg-brand-400/20 animate-ping opacity-30" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-brand-50 dark:from-slate-800 dark:to-slate-900 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-inner">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
            {t.loggedOut.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto mb-8">
            {t.loggedOut.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>{t.loggedOut.buttons.login}</span>
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 font-semibold text-sm transition-all transform hover:-translate-y-0.5"
            >
              <span>{t.loggedOut.buttons.home}</span>
            </Link>
          </div>
        </div>

        {/* 3 Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-up">
          {/* Card 1: Streaks */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 flex flex-col items-start transition-all hover:border-amber-500/40 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-500 flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              {t.loggedOut.features[0].title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.loggedOut.features[0].description}
            </p>
          </div>

          {/* Card 2: Course Progress */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 flex flex-col items-start transition-all hover:border-teal-500/40 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-900/60 text-teal-500 flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              {t.loggedOut.features[1].title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.loggedOut.features[1].description}
            </p>
          </div>

          {/* Card 3: Achievements */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl p-6 flex flex-col items-start transition-all hover:border-purple-500/40 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/60 text-purple-500 flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              {t.loggedOut.features[2].title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.loggedOut.features[2].description}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (profileQuery.isPending) {
    return <ProfileViewSkeleton />
  }

  // If the stats fail to load, still show the account (logout, Settings) from
  // /auth/me with zeroed stats, plus a retry banner.
  const profile = profileQuery.data ?? {
    username: user.username,
    name: user.displayName || user.username,
    role: user.role,
    year: user.year,
    memberSince: user.created,
    og: false,
    stats: {},
  }

  return (
    <>
      {!profileQuery.data && (
        <div className="max-w-4xl mx-auto pt-8">
          <ErrorState variant="banner" message={profileQuery.error ?? t.public.loadError} onRetry={profileQuery.refetch} />
        </div>
      )}
      <ProfileView
        profile={profile}
      isOwn
      onLogout={handleLogout}
        logoutPending={logoutMutation.isPending}
      />
    </>
  )
}

export default Profile
