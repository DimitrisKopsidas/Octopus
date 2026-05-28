import t from '../../content/courseStart.json'

function SystematicStudyPanel({
  total,
  setSize,
  totalSets,
  sets,
  completedSets,
  defaultTimerMinutes,
  coveragePercentage,
  starting,
  onStartSet,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
      <div className="rounded-lg bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/60 p-4">
        <h3 className="font-semibold text-brand-900 dark:text-brand-300 text-sm mb-1">
          {t.systematic.explanationTitle}
        </h3>
        <p className="text-xs text-brand-800 dark:text-brand-400 leading-relaxed">
          {t.systematic.explanationTemplate
            .replace('{setSize}', setSize)
            .replace('{total}', total)
            .replace('{totalSets}', totalSets)}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t.systematic.coverageLabel}
          </span>
          <span className="text-xl font-bold text-brand-600 dark:text-brand-400 tabular-nums">
            {coveragePercentage}% {coveragePercentage === 100 && '🏆'}
          </span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 rounded-full"
            style={{ width: `${coveragePercentage}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          {coveragePercentage === 100 ? t.systematic.coverageDone : t.systematic.coveragePending}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sets.map((set) => {
          const completed = completedSets[set.index]
          return (
            <SetCard
              key={set.index}
              set={set}
              completed={completed}
              defaultTimerMinutes={defaultTimerMinutes}
              starting={starting}
              onStart={() => onStartSet(set)}
            />
          )
        })}
      </div>
    </div>
  )
}

function SetCard({ set, completed, defaultTimerMinutes, starting, onStart }) {
  return (
    <div
      className={`flex flex-col rounded-lg border p-4 shadow-sm transition-all ${
        completed
          ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-300 dark:border-slate-800'
          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
            {t.systematic.setLabel} {set.index + 1}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.systematic.setRangeTemplate
              .replace('{start}', set.start)
              .replace('{end}', set.end)
              .replace('{count}', set.count)}
          </p>
          {defaultTimerMinutes != null && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 inline-flex items-center gap-1">
              <span aria-hidden="true">⏱</span>
              {t.systematic.setTimerTemplate.replace('{minutes}', defaultTimerMinutes)}
            </p>
          )}
        </div>
        {completed && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
            ✓ {completed.score}/{completed.total}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onStart}
        disabled={starting}
        className={`mt-auto w-full py-2 rounded-md text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
          completed
            ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
            : 'bg-brand-600 hover:bg-brand-700 text-white'
        }`}
      >
        {starting ? t.systematic.loadingSet : completed ? t.systematic.repeatSet : t.systematic.startSet}
      </button>
    </div>
  )
}

export default SystematicStudyPanel
