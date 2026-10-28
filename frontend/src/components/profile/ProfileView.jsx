// Profile layout shared by /profile (isOwn) and /profile/:username.
// Own profile adds: Discord, Settings link, logout and a link to /achievements.
import { Link } from 'react-router-dom'
import { Calendar, GraduationCap, LogOut, Settings, Waves, Percent, BookOpen, PenLine, ArrowRight } from 'lucide-react'
import UserAvatar from '../user/UserAvatar'
import RoleBadge from '../user/RoleBadge'
import UserBadges from '../user/UserBadges'
import Skeleton from '../ui/Skeleton'
import logo from '../../assets/logo.png'
import InkAvatar from './InkAvatar'
import { computeBadges, hasBadge } from '../../lib/badges'
import { cohortLabel, formatMemberSince, profileStats } from '../../lib/profiles'
import t from '../../content/profile.json'

const STAT_STYLE = {
  quizzes: { icon: Waves, tone: 'bg-brand-50 dark:bg-brand-950/50 border-brand-200 dark:border-brand-900/60 text-brand-600 dark:text-brand-400' },
  avgScore: { icon: Percent, tone: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400' },
  courses: { icon: BookOpen, tone: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400' },
  questions: { icon: PenLine, tone: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-900/60 text-sky-600 dark:text-sky-400' },
}

const BANNER = {
  ADMIN: 'from-rose-500 via-fuchsia-600 to-brand-700',
  HELPER: 'from-amber-400 via-orange-500 to-brand-700',
  STUDENT: 'from-brand-400 via-teal-600 to-brand-800',
}

function ProfileStat({ icon: Icon, label, value, tone }) {
  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-2 sm:gap-3.5 text-center sm:text-left min-w-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${tone}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 max-w-full">
        <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums leading-tight">{value}</p>
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-normal sm:tracking-wider text-slate-500 dark:text-slate-400 break-words">{label}</p>
      </div>
    </div>
  )
}

export function ProfileViewSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6 animate-pulse">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
        <Skeleton className="h-28 w-full rounded-none" />
        <div className="p-6 flex items-end gap-4 -mt-14">
          <Skeleton className="w-24 h-24 rounded-3xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
      <Skeleton className="h-48 rounded-3xl" />
    </div>
  )
}

/**
 * @param profile  PublicUserDto
 */
function ProfileView({ profile, isOwn = false, onLogout, logoutPending = false }) {
  const badges = computeBadges(profile)
  const founder = hasBadge(badges, 'FOUNDER')
  const cohort = cohortLabel(profile.year)
  const anyEarned = badges.some((b) => b.earned)

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6 animate-fade-up">
      {/* Header */}
      <section className="group relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className={`relative h-28 sm:h-32 bg-gradient-to-br ${BANNER[profile.role] ?? BANNER.STUDENT}`}>
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_30%,white_0,transparent_25%),radial-gradient(circle_at_80%_70%,white_0,transparent_20%)]" />
          {founder && (
            <div className="absolute right-4 bottom-0 translate-y-6 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-500" aria-hidden="true">
              <img src={logo} alt="" className="w-16 h-16 animate-float" />
              <span className="absolute -top-6 right-14 whitespace-nowrap rounded-lg bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 text-[11px] font-bold text-brand-700 dark:text-brand-300 shadow">
                {t.own.founderWave}
              </span>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Only the avatar overlaps the banner; the name sits below it. */}
            <div className="-mt-12 shrink-0">
            <InkAvatar>
              <UserAvatar
                name={profile.name}
                username={profile.username}
                role={profile.role}
                size="xl"
                className="ring-4 ring-white dark:ring-slate-900"
              />
            </InkAvatar>
            </div>

            <div className="flex-1 min-w-0 space-y-1.5 pt-1 sm:pt-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">{profile.name}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <RoleBadge role={profile.role} />
              </div>
            </div>

            {isOwn && (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/settings"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  {t.own.settingsLink}
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={logoutPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  {logoutPending ? t.accountInfo.logoutPending : t.accountInfo.logoutButton}
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatMemberSince(profile.memberSince)}
            </span>
            {cohort && (
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                {cohort}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Stats: which ones depends on the role (lib/profiles.js) */}
      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        {profileStats(profile).map((stat) => (
          <ProfileStat key={stat.key} icon={STAT_STYLE[stat.key].icon} label={stat.label} value={stat.value} tone={STAT_STYLE[stat.key].tone} />
        ))}
      </section>

      {/* Badges */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{t.badges.title}</h2>
          {/* The full list with locked goals and progress lives on /achievements. */}
          {isOwn && (
            <Link to="/achievements" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              {t.achievements.seeAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        {anyEarned ? (
          <UserBadges user={profile} variant="grid" />
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">{isOwn ? t.badges.emptyOwn : t.badges.emptyOther}</p>
        )}
      </section>
    </div>
  )
}

export default ProfileView
