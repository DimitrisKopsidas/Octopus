import { BookOpen } from 'lucide-react'
import { formatValue } from './leaderboardUtils'
import t from '../../content/leaderboard.json'

function LeaderboardList({
  items,
  tab,
  startIndex = 0,
  currentUserRankIndex = -1,
  currentUserRow = null,
  currentUserRank = null,
  pageSize = 10,
  onGoToPage = null,
}) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.empty.noData}</p>
      </div>
    )
  }

  const isUserInCurrentSlice =
    currentUserRank != null &&
    currentUserRank >= startIndex + 1 &&
    currentUserRank <= startIndex + items.length

  const showPinnedRow = !isUserInCurrentSlice && currentUserRow && currentUserRank != null

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-sm">
      <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {items.map((row, idx) => {
          const absoluteIndex = startIndex + idx
          const rank = absoluteIndex + 1
          const isTop3 = rank <= 3
          const isCurrentUser = currentUserRankIndex !== -1 && absoluteIndex === currentUserRankIndex

          return (
            <li
              key={`${row.name}-${rank}`}
              className={`flex items-center justify-between px-4 sm:px-6 py-3.5 transition-all ${
                isCurrentUser
                  ? 'bg-brand-50/80 dark:bg-brand-950/40 ring-2 ring-inset ring-brand-500/80 font-semibold'
                  : rank === 1
                  ? 'bg-amber-50/50 dark:bg-amber-950/20'
                  : rank === 2
                  ? 'bg-slate-50/60 dark:bg-slate-800/20'
                  : rank === 3
                  ? 'bg-amber-900/5 dark:bg-amber-950/10'
                  : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-4">
                <span
                  className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                    rank === 1
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                      : rank === 2
                      ? 'bg-slate-400 dark:bg-slate-500 text-white'
                      : rank === 3
                      ? 'bg-amber-700/80 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {rank}
                </span>
                <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                  {row.name || 'Ανώνυμος'}
                </span>
                {isCurrentUser && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/70 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700/60 shrink-0">
                    {t.userRank?.you || 'Εσύ'}
                  </span>
                )}
              </div>

              <div className="shrink-0 font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                <span
                  className={
                    isTop3
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                >
                  {formatValue(tab, row.value)}
                </span>
              </div>
            </li>
          )
        })}

        {/* Pinned user row when user is on another page */}
        {showPinnedRow && (
          <>
            <li className="flex items-center justify-center py-2 bg-slate-50/60 dark:bg-slate-950/40 text-slate-300 dark:text-slate-600 select-none">
              <span className="text-xs font-black tracking-[0.35em]">•••</span>
            </li>
            <li
              onClick={() => onGoToPage?.(Math.ceil(currentUserRank / pageSize))}
              title={t.pinnedRow?.tooltip || 'Κλικ για μετάβαση στη σελίδα σου'}
              className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-brand-50/90 dark:bg-brand-950/60 ring-2 ring-inset ring-brand-500/80 font-semibold border-t-2 border-brand-200 dark:border-brand-800/80 shadow-inner cursor-pointer hover:bg-brand-100/80 dark:hover:bg-brand-900/70 transition-all group"
            >
              <div className="flex items-center gap-3.5 min-w-0 pr-4">
                <span className="w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center shrink-0 bg-brand-600 text-white shadow-sm shadow-brand-600/30">
                  {currentUserRank}
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {currentUserRow.name || 'Ανώνυμος'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-200/80 dark:bg-brand-900 text-brand-800 dark:text-brand-300 border border-brand-300 dark:border-brand-700/60 shrink-0">
                  {t.userRank?.you || 'Εσύ'}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-extrabold text-sm sm:text-base text-brand-600 dark:text-brand-400">
                  {formatValue(tab, currentUserRow.value)}
                </span>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  {(t.pinnedRow?.goToPage || 'Σελ. {page} →').replace('{page}', Math.ceil(currentUserRank / pageSize))}
                </span>
              </div>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}

export default LeaderboardList
