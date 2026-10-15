import { Link } from 'react-router-dom'
import { Sparkles, LogIn } from 'lucide-react'
import { formatValue } from './leaderboardUtils'
import t from '../../content/leaderboard.json'

function LeaderboardUserCard({
  user,
  isUserTab,
  currentUserRank,
  currentUserRow,
  total,
  safePage,
  totalPages,
  pageSize,
  tab,
  onGoToUserPage,
}) {
  // 1. Unauthenticated visitor prompt in user-oriented tabs
  if (!user && isUserTab) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-brand-50/80 via-white to-brand-50/40 dark:from-brand-950/40 dark:via-slate-900 dark:to-brand-950/20 border border-brand-200/70 dark:border-brand-800/60 shadow-sm animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t.authPrompt?.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.authPrompt?.subtitle}
            </p>
          </div>
        </div>
        <Link
          to="/login"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20 transition-all cursor-pointer shrink-0"
        >
          <LogIn className="w-4 h-4" />
          <span>{t.authPrompt?.button}</span>
        </Link>
      </div>
    )
  }

  // 2. Current user rank indicator
  if (currentUserRank && currentUserRow) {
    const userTargetPage = Math.ceil(currentUserRank / pageSize)
    const showPageJumpBtn = totalPages > 1 && safePage !== userTargetPage

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-brand-50/90 via-brand-50/40 to-transparent dark:from-brand-950/40 dark:via-brand-950/20 border border-brand-200/80 dark:border-brand-800/60 shadow-sm animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-brand-600/25 shrink-0">
            #{currentUserRank}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                {t.userRank?.yourRank || 'Η θέση σου'}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                ({(t.userRank?.outOf || 'από {total} συμμετέχοντες').replace('{total}', total)})
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {currentUserRow.name || 'Ανώνυμος'}{' '}
              <span className="text-brand-600 dark:text-brand-400 font-extrabold ml-1">
                • {formatValue(tab, currentUserRow.value)}
              </span>
            </p>
          </div>
        </div>

        {showPageJumpBtn && (
          <button
            type="button"
            onClick={() => onGoToUserPage?.(userTargetPage)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-700 border border-brand-200/80 dark:border-brand-800/80 shadow-sm transition-all cursor-pointer"
          >
            {t.userRank?.viewInList || 'Προβολή στη λίστα'} (Σελ. {userTargetPage})
          </button>
        )}
      </div>
    )
  }

  return null
}

export default LeaderboardUserCard
