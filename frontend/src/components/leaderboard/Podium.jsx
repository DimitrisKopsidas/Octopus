import { Trophy, Medal, Sparkles } from 'lucide-react'
import { formatValue } from './leaderboardUtils'
import t from '../../content/leaderboard.json'

function Podium({ items, tab }) {
  if (!items || items.length === 0) return null

  const first = items[0]
  const second = items.length > 1 ? items[1] : null
  const third = items.length > 2 ? items[2] : null

  // 1 Item only: Centered gold pedestal
  if (!second) {
    return (
      <div className="flex justify-center max-w-xs mx-auto pt-4 pb-6">
        <div className="flex flex-col items-center text-center w-full">
          <div className="relative mb-2">
            <Sparkles className="w-5 h-5 text-amber-500 absolute -top-2 -right-2 animate-bounce" />
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-500 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/20">
              <Trophy className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            {t.podium.gold}
          </span>
          <span className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 max-w-full px-1">
            {first.name || 'Ανώνυμος'}
          </span>
          <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
            {formatValue(tab, first.value)}
          </span>
          <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-amber-200/80 to-amber-100 dark:from-amber-950/70 dark:to-amber-900/40 rounded-t-xl mt-3 border-t-2 border-amber-400 dark:border-amber-500 shadow-sm" />
        </div>
      </div>
    )
  }

  // 2 Items: Silver on left, Gold on right
  if (!third) {
    return (
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4 pb-6 items-end">
        {/* 2nd Place */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-500 shadow-md mb-2">
            <Medal className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {t.podium.silver}
          </span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-full px-1">
            {second.name || 'Ανώνυμος'}
          </span>
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-0.5">
            {formatValue(tab, second.value)}
          </span>
          <div className="w-full h-16 sm:h-20 bg-gradient-to-t from-slate-200/90 to-slate-100 dark:from-slate-800 dark:to-slate-850 rounded-t-xl mt-3 border-t-2 border-slate-300 dark:border-slate-600" />
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <Sparkles className="w-5 h-5 text-amber-500 absolute -top-2 -right-2 animate-bounce" />
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-500 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/20">
              <Trophy className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            {t.podium.gold}
          </span>
          <span className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 max-w-full px-1">
            {first.name || 'Ανώνυμος'}
          </span>
          <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
            {formatValue(tab, first.value)}
          </span>
          <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-amber-200/80 to-amber-100 dark:from-amber-950/70 dark:to-amber-900/40 rounded-t-xl mt-3 border-t-2 border-amber-400 dark:border-amber-500 shadow-sm" />
        </div>
      </div>
    )
  }

  // 3 or more Items: Classic 3-pedestal podium
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto pt-4 pb-6 items-end">
      {/* 2nd Place */}
      <div className="flex flex-col items-center text-center order-1">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-500 shadow-md mb-2">
          <Medal className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          {t.podium.silver}
        </span>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-full px-1">
          {second.name || 'Ανώνυμος'}
        </span>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-0.5">
          {formatValue(tab, second.value)}
        </span>
        <div className="w-full h-16 sm:h-20 bg-gradient-to-t from-slate-200/90 to-slate-100 dark:from-slate-800 dark:to-slate-850 rounded-t-xl mt-3 border-t-2 border-slate-300 dark:border-slate-600" />
      </div>

      {/* 1st Place */}
      <div className="flex flex-col items-center text-center order-2">
        <div className="relative mb-2">
          <Sparkles className="w-5 h-5 text-amber-500 absolute -top-2 -right-2 animate-bounce" />
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-500 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/20">
            <Trophy className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
        </div>
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
          {t.podium.gold}
        </span>
        <span className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 max-w-full px-1">
          {first.name || 'Ανώνυμος'}
        </span>
        <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
          {formatValue(tab, first.value)}
        </span>
        <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-amber-200/80 to-amber-100 dark:from-amber-950/70 dark:to-amber-900/40 rounded-t-xl mt-3 border-t-2 border-amber-400 dark:border-amber-500 shadow-sm" />
      </div>

      {/* 3rd Place */}
      <div className="flex flex-col items-center text-center order-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-900/10 dark:bg-amber-950/40 border-2 border-amber-700/40 flex items-center justify-center text-amber-700 dark:text-amber-500 shadow-md mb-2">
          <Medal className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <span className="text-xs font-bold text-amber-800 dark:text-amber-600 uppercase tracking-wider mb-1">
          {t.podium.bronze}
        </span>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-full px-1">
          {third.name || 'Ανώνυμος'}
        </span>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-0.5">
          {formatValue(tab, third.value)}
        </span>
        <div className="w-full h-12 sm:h-14 bg-gradient-to-t from-amber-100/60 to-slate-100 dark:from-amber-950/40 dark:to-slate-850 rounded-t-xl mt-3 border-t-2 border-amber-700/40" />
      </div>
    </div>
  )
}

export default Podium
