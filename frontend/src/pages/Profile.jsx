// Profile page. Route: /profile
import { Link, useNavigate } from 'react-router-dom'
import {
  AtSign,
  GraduationCap,
  Shield,
  Calendar,
  LogOut,
  Settings,
  Heart,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { useMe, useLogout } from '../hooks/queries'
import { roleLabel, userInitial } from '../lib/roles'
import { toast } from '../store/toastStore'
import Skeleton from '../components/ui/Skeleton'
import { formatEnrollmentYear } from '../lib/years'
import t from '../content/profile.json'

function Profile() {
  const navigate = useNavigate()
  const { user, isLoading } = useMe()
  const logoutMutation = useLogout()

  async function handleLogout() {
    await logoutMutation.mutateAsync().catch(() => { })
    toast.success('Αποσυνδέθηκες επιτυχώς.')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6 animate-pulse">
        {/* Header Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
          <div className="text-center md:text-left flex-1 space-y-2.5 w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Skeleton className="h-7 w-44 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48 rounded-md mx-auto md:mx-0" />
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>

        {/* Account Info Card Skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-4">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
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

  const initial = userInitial(user)
  const label = roleLabel(user)

  const formattedJoinedDate = user.created
    ? new Date(user.created).toLocaleDateString('el-GR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '29 Αυγούστου 2026'

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-500/60 text-teal-600 dark:text-teal-400 text-3xl font-bold flex items-center justify-center shadow-lg shadow-teal-500/10 shrink-0">
          {initial}
        </div>

        {/* User Titles & Meta */}
        <div className="text-center md:text-left flex-1 min-w-0 space-y-1.5">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
            {user.displayName || user.username}
          </h1>

          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {label}
            </span>
          </div>
        </div>

        {/* Right Side: Joined Date & Logout */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
          <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {t.accountInfo.labels.joined} {formattedJoinedDate}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{logoutMutation.isPending ? t.accountInfo.logoutPending : t.accountInfo.logoutButton}</span>
          </button>
        </div>
      </div>

      {/* Account Info Card (Exact 4 Cards Grid) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          {t.accountInfo.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Username */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-900/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <AtSign className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-semibold uppercase tracking-wider">
                {t.accountInfo.labels.username}
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base font-mono block truncate">
                @{user.username}
              </span>
            </div>
          </div>

          {/* Enrollment Year */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-semibold uppercase tracking-wider">
                {t.accountInfo.labels.year}
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base block">
                {formatEnrollmentYear(user.year) ?? t.accountInfo.notSet}
              </span>
            </div>
          </div>

          {/* Role */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-semibold uppercase tracking-wider">
                {t.accountInfo.labels.role}
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base block">
                {label}
              </span>
            </div>
          </div>

          {/* Discord Handle */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[11px] font-semibold uppercase tracking-wider">
                {t.accountInfo.labels.discord}
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base font-mono block truncate">
                {user.discordName ? `@${user.discordName.replace(/^@/, '')}` : t.accountInfo.notSet}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shortcuts Section (Inactive / Preview Cards) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          {t.shortcuts.title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Quizzes */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-default select-none">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-900/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.shortcuts.quizzes.title}
              </p>
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                {t.shortcuts.quizzes.subtitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.shortcuts.quizzes.desc}
              </p>
            </div>
          </div>

          {/* Favorites */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-default select-none">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-500 dark:text-rose-400 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.shortcuts.favorites.title}
              </p>
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                {t.shortcuts.favorites.subtitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.shortcuts.favorites.desc}
              </p>
            </div>
          </div>

          {/* Settings */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-default select-none">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-4">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.shortcuts.settings.title}
              </p>
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                {t.shortcuts.settings.subtitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.shortcuts.settings.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
