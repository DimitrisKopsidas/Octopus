// One badge category (Κουίζ, Creator, Προκλήσεις, Special): a title, an optional
// count, then its badges. "special" (OG, Founder) gets a gold frame.
import { Sparkles } from 'lucide-react'

function BadgeCategory({ categoryKey, title, count, large = false, children }) {
  const special = categoryKey === 'special'

  return (
    <section
      className={
        special
          ? 'rounded-2xl border border-amber-300/70 dark:border-amber-700/60 bg-gradient-to-br from-amber-50 via-white to-amber-100/60 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-900/20 p-4 shadow-sm shadow-amber-500/10 space-y-3'
          : 'space-y-3'
      }
    >
      <div className="flex items-center justify-between gap-3">
        <h3
          className={`flex items-center gap-1.5 font-bold ${large ? 'text-lg' : 'text-xs uppercase tracking-wider'} ${
            special ? 'text-amber-700 dark:text-amber-300' : large ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {special && <Sparkles className="w-4 h-4" />}
          {title}
        </h3>
        {count && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">{count}</span>}
      </div>
      {children}
    </section>
  )
}

export default BadgeCategory
