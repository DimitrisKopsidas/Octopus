// Achievement badges of a PublicUserDto (computed in lib/badges.js).
//   variant="chips" -> compact row of earned badges (cards, modal)
//   variant="grid"  -> earned badges as cards, grouped by category (profile). Locked goals and
//                      progress live on /achievements.
import { badgeView, computeBadges, groupBadges } from '../../lib/badges'
import BadgeCategory from './BadgeCategory'

function UserBadges({ user, variant = 'chips', max, className = '' }) {
  const earned = computeBadges(user).filter((b) => b.earned)
  const views = earned
    .map(badgeView)
    .filter(Boolean)
  const shown = max ? views.slice(0, max) : views

  if (shown.length === 0) return null

  if (variant === 'chips') {
    return (
      <div className={`flex flex-wrap gap-1.5 ${className}`}>
        {shown.map((b) => (
          <span
            key={b.code}
            title={`${b.name}: ${b.description}`}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${b.tone}`}
          >
            <b.Icon className="w-3 h-3" />
            {b.name}
          </span>
        ))}
        {max && views.length > max && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400">
            +{views.length - max}
          </span>
        )}
      </div>
    )
  }

  // Grid: grouped by category (lib/badges.js), empty categories dropped.
  const groups = groupBadges(earned)

  return (
    <div className={`space-y-5 ${className}`}>
      {groups.map((group) => (
        <BadgeCategory key={group.key} categoryKey={group.key} title={group.title}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.badges.map(badgeView).filter(Boolean).map((b) => (
              <div
                key={b.code}
                className={`relative p-4 rounded-2xl border flex items-start gap-3 transition-transform hover:-translate-y-0.5 ${b.tone}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/70 dark:bg-slate-900/60 flex items-center justify-center shrink-0">
                  <b.Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {b.name}
                    {b.tiered && (
                      <span className="ml-1.5 text-[10px] font-semibold opacity-70">
                        {b.tier}/{b.maxTier}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </BadgeCategory>
      ))}
    </div>
  )
}

export default UserBadges
