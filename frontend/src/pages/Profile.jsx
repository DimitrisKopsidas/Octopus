// Profile page. Route: /profile
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMe, useLogout } from '../hooks/queries'
import { authApi } from '../lib/api'
import { roleLabel, userInitial } from '../lib/roles'
import { toast } from '../store/toastStore'
import Skeleton from '../components/ui/Skeleton'
import t from '../content/profile.json'

function Profile() {
  const navigate = useNavigate()
  const { user, isLoading } = useMe()
  const logoutMutation = useLogout()

  const [testResult, setTestResult] = useState(null)
  const [testingEndpoint, setTestingEndpoint] = useState(null)

  async function handleLogout() {
    await logoutMutation.mutateAsync().catch(() => { })
    toast.success('Αποσυνδέθηκες επιτυχώς.')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6 animate-pulse">
        {/* Header Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-full shrink-0" />
          <div className="text-center md:text-left flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Skeleton className="h-7 w-44 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-28 rounded-md mx-auto md:mx-0" />
          </div>
          <Skeleton className="h-9 w-28 rounded-xl shrink-0" />
        </div>

        {/* Account Info Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-40 rounded-lg pb-3 border-b border-slate-100 dark:border-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Skeleton className="h-3 w-24" /><Skeleton className="h-5 w-40" /></div>
            <div className="space-y-1.5"><Skeleton className="h-3 w-20" /><Skeleton className="h-5 w-32" /></div>
            <div className="space-y-1.5"><Skeleton className="h-3 w-16" /><Skeleton className="h-5 w-28" /></div>
            <div className="space-y-1.5"><Skeleton className="h-3 w-20" /><Skeleton className="h-5 w-36" /></div>
            <div className="space-y-1.5"><Skeleton className="h-3 w-24" /><Skeleton className="h-5 w-28" /></div>
          </div>
        </div>

        {/* RBAC Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    )
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-transparent border-1 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold text-sm transition-all transform hover:-translate-y-0.5"
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

  const initial = userInitial(user)
  const label = roleLabel(user)

  async function testRbac(endpointName, apiFn) {
    setTestingEndpoint(endpointName)
    setTestResult(null)
    try {
      const res = await apiFn()
      setTestResult({
        success: true,
        endpoint: endpointName,
        data: res,
      })
    } catch (err) {
      setTestResult({
        success: false,
        endpoint: endpointName,
        status: err?.response?.status || 'Error',
        message: err?.response?.data?.message || err?.message || 'Access Denied',
      })
    } finally {
      setTestingEndpoint(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-brand-600 text-white text-3xl font-bold flex items-center justify-center shadow-md">
          {initial}
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {user.displayName}
            </h1>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {label}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            @{user.username}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="px-4 py-2 text-sm font-medium rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
        >
          {logoutMutation.isPending ? t.accountInfo.logoutPending : t.accountInfo.logoutButton}
        </button>
      </div>

      {/* Account Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
          {t.accountInfo.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400 block text-xs uppercase font-medium">{t.accountInfo.labels.displayName}</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{user.displayName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs uppercase font-medium">{t.accountInfo.labels.username}</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">@{user.username}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs uppercase font-medium">{t.accountInfo.labels.year}</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {user.year ? (user.year >= 5 ? '5ο+ Έτος' : `${user.year}ο Έτος`) : t.accountInfo.notSet}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs uppercase font-medium">{t.accountInfo.labels.role}</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{user.role} ({label})</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs uppercase font-medium">{t.accountInfo.labels.favorites}</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {user.myCourseIds ? `${user.myCourseIds.length || user.myCourseIds.size || 0} ${t.accountInfo.coursesCount}` : `0 ${t.accountInfo.coursesCount}`}
            </span>
          </div>
        </div>
      </div>

      {/* RBAC Live Endpoint Testing Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
          {t.rbacTest.title}
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => testRbac('/access/student', authApi.accessStudent)}
            disabled={testingEndpoint != null}
            className="px-3.5 py-2 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {t.rbacTest.buttons.student}
          </button>
          <button
            type="button"
            onClick={() => testRbac('/access/helper', authApi.accessHelper)}
            disabled={testingEndpoint != null}
            className="px-3.5 py-2 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {t.rbacTest.buttons.helper}
          </button>
          <button
            type="button"
            onClick={() => testRbac('/access/admin', authApi.accessAdmin)}
            disabled={testingEndpoint != null}
            className="px-3.5 py-2 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {t.rbacTest.buttons.admin}
          </button>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded-xl text-xs font-mono border ${testResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
              }`}
          >
            <div className="font-semibold mb-1">
              {testResult.success ? t.rbacTest.statusSuccess : `${t.rbacTest.statusError} (${testResult.status})`}
            </div>
            <div>Endpoint: {testResult.endpoint}</div>
            <pre className="mt-2 overflow-x-auto p-2 rounded bg-black/5 dark:bg-black/40">
              {JSON.stringify(testResult.success ? testResult.data : testResult.message, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
