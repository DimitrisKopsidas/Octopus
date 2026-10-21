// Community member cards and rows. All of them open the preview modal on click.
//   CrewCard    -> bigger card for admins/helpers ("Το πλήρωμα")
//   MemberRow   -> list row for the Creators / Καλωσορίστε panels
import UserAvatar from '../user/UserAvatar'
import RoleBadge from '../user/RoleBadge'
import UserBadges from '../user/UserBadges'
import { openUserPreview } from '../../store/userPreviewStore'
import { statsOf } from '../../lib/profiles'
import t from '../../content/community.json'

const cardBase =
  'text-left rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-300 dark:hover:border-brand-700 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'

export function CrewCard({ member }) {
  const stats = statsOf(member)
  return (
    <button type="button" onClick={() => openUserPreview(member.username)} aria-label={t.cardLabel.replace('{name}', member.name)} className={`${cardBase} w-full h-full p-5 flex items-center gap-4`}>
      <UserAvatar name={member.name} username={member.username} role={member.role} size="lg" />
      <div className="min-w-0 space-y-1.5">
        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{member.name}</p>
        <RoleBadge role={member.role} />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {/* "0 ερωτήσεις" reads as a negative; show quizzes instead until they write one. */}
          {stats.questionsCreated > 0
            ? (stats.questionsCreated === 1 ? t.crew.questionsOne : t.crew.questions.replace('{count}', stats.questionsCreated))
            : t.memberQuizzes.replace('{count}', stats.quizzesCompleted)}
        </p>
        <UserBadges user={member} max={2} />
      </div>
    </button>
  )
}

/** One row of a Community side panel: avatar, name, a subtitle and something on the right. */
export function MemberRow({ member, rank, subtitle, aside }) {
  return (
    <button
      type="button"
      onClick={() => openUserPreview(member.username)}
      aria-label={t.cardLabel.replace('{name}', member.name)}
      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {rank != null && (
        <span className={`w-6 text-center text-sm font-extrabold tabular-nums ${rank === 1 ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}>
          {rank}
        </span>
      )}
      <UserAvatar name={member.name} username={member.username} role={member.role} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 break-words">{member.name}</p>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>}
      </div>
      {aside}
    </button>
  )
}
