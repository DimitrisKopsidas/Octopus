// Own achievements. Route: /achievements (login required; logged out sees a teaser).
// Grouped like the profile (Κουίζ, Creator, Προκλήσεις, Special); tiered badges show their whole ladder. What's earned
// is in colour, the rest grey.
// Rules and thresholds: lib/badges.js. Students get no Creator ladder.
import { Link } from 'react-router-dom'
import { Check, Lock, Trophy } from 'lucide-react'
import { useMe, usePublicProfile } from '../hooks/queries'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import { TIER_THRESHOLDS, badgeView, computeBadges, groupBadges, isGoal } from '../lib/badges'
import BadgeCategory from '../components/user/BadgeCategory'
import t from '../content/profile.json'

const a = t.achievements

function ProgressBar({ value }) {
  return (
    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div className="h-full rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  )
}

function TierLadder({ badge }) {
  const view = badgeView(badge)
  const text = t.badges.items[badge.code]
  const thresholds = TIER_THRESHOLDS[badge.code]
  const nextName = text.tiers[badge.tier]

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
      <p className="text-xs text-slate-500 dark:text-slate-400">{text.description}</p>

      <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {text.tiers.map((name, i) => {
          const reached = i < badge.tier
          return (
            <li
              key={name}
              className={`rounded-2xl border p-3 text-center ${reached ? view.tone : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 grayscale'}`}
            >
              <div className="mx-auto mb-1.5 w-7 h-7 rounded-full bg-white/80 dark:bg-slate-900/70 flex items-center justify-center">
                {reached ? <Check className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
              </div>
              <p className={`text-xs font-bold ${reached ? 'text-slate-900 dark:text-slate-100' : ''}`}>{name}</p>
              <p className="text-[11px] font-semibold opacity-80">
                {a.tierTarget.replace('{target}', thresholds[i]).replace('{unit}', text.unit)}
              </p>
            </li>
          )
        })}
      </ol>

      {badge.nextTarget != null ? (
        <div className="space-y-1.5">
          <ProgressBar value={Math.min(badge.progress / badge.nextTarget, 1)} />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {a.next.replace('{name}', nextName).replace('{current}', badge.progress).replace('{target}', badge.nextTarget)}
          </p>
        </div>
      ) : (
        <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">{a.maxed}</p>
      )}
    </div>
  )
}

function SpecialBadge({ badge }) {
  const view = badgeView(badge)

  return (
    <div className={`p-4 rounded-2xl border flex items-start gap-3 ${view.tone} ${badge.earned ? '' : 'grayscale'}`}>
      <div className="w-10 h-10 rounded-xl bg-white/70 dark:bg-slate-900/60 flex items-center justify-center shrink-0">
        {badge.earned ? <view.Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{view.name}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{view.description}</p>
        {badge.earned && <p className="mt-1 text-[11px] font-semibold">{a.earned}</p>}
      </div>
    </div>
  )
}

function LoggedOut() {
  return (
    <div className="max-w-xl mx-auto py-16 text-center space-y-4 animate-fade-up">
      <div className="mx-auto w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-500 flex items-center justify-center">
        <Trophy className="w-10 h-10" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{a.loggedOut.title}</h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{a.loggedOut.subtitle}</p>
      <Link
        to="/login"
        className="inline-flex px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all"
      >
        {a.loggedOut.login}
      </Link>
    </div>
  )
}

function Achievements() {
  const { user, isLoading } = useMe()
  const { data: profile, isPending, error, refetch } = usePublicProfile(user?.username)

  if (!isLoading && !user) return <LoggedOut />

  if (isLoading || isPending) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4">
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <ErrorState message={error ?? t.public.loadError} onRetry={refetch} />
      </div>
    )
  }

  const badges = computeBadges(profile).filter((b) => isGoal(b, profile.role))
  const unlocked = badges.reduce((sum, b) => sum + b.tier, 0)
  const total = badges.reduce((sum, b) => sum + b.maxTier, 0)

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6 animate-fade-up">
      <section className="rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 p-6 sm:p-8 shadow-xl text-white space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{a.title}</h1>
            <p className="text-sm text-brand-100/90 max-w-lg">{a.subtitle}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/15 px-4 py-2 text-sm font-bold tabular-nums">
            <Trophy className="w-4 h-4 text-amber-300" />
            {a.counter.replace('{count}', unlocked).replace('{total}', total)}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/15 overflow-hidden">
          <div className="h-full rounded-full bg-amber-300 transition-all duration-700" style={{ width: `${total ? Math.round((unlocked / total) * 100) : 0}%` }} />
        </div>
      </section>

      {groupBadges(badges).map((group) => {
        const done = group.badges.reduce((sum, b) => sum + b.tier, 0)
        const all = group.badges.reduce((sum, b) => sum + b.maxTier, 0)
        return (
          <BadgeCategory key={group.key} categoryKey={group.key} title={group.title} count={`${done}/${all}`} large>
            {group.badges.map((b) => (TIER_THRESHOLDS[b.code] ? <TierLadder key={b.code} badge={b} /> : null))}
            {group.badges.some((b) => !TIER_THRESHOLDS[b.code]) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.badges.filter((b) => !TIER_THRESHOLDS[b.code]).map((b) => <SpecialBadge key={b.code} badge={b} />)}
              </div>
            )}
          </BadgeCategory>
        )
      })}
    </div>
  )
}

export default Achievements
