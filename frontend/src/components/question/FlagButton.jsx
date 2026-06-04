// Toggle flag-for-review button. Used by Test.
import t from '../../content/test.json'

function FlagButton({ flagged, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={flagged}
      aria-label={flagged ? t.flag.removeLabel : t.flag.addLabel}
      title={flagged ? t.flag.removeTooltip : t.flag.addTooltip}
      className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
        flagged
          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-700 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700'
      }`}
    >
      <span aria-hidden="true">{flagged ? '🔖' : '🏷'}</span>
      {flagged ? t.flag.marked : t.flag.mark}
    </button>
  )
}

export default FlagButton
