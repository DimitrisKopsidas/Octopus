// Custom test settings (count slider + timer). Used by CourseStart (step 3).
import TimerOption from './TimerOption'
import t from '../../content/courseStart.json'

function SandboxPanel({
  max,
  count,
  setCount,
  durationSeconds,
  setDurationSeconds,
  timerOptions,
  coveragePercentage,
  starting,
  canStart,
  onStart,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
        <h2 className="font-semibold text-slate-900 dark:text-slate-200 text-sm">{t.sandbox.title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.sandbox.subtitle}</p>
      </header>

      <div className="px-6 py-5 space-y-6">
{/*         {coveragePercentage < 100 && ( */}
{/*           <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60 p-4"> */}
{/*             <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed"> */}
{/*               {t.sandbox.warningTemplate} */}
{/*             </p> */}
{/*           </div> */}
{/*         )} */}

        <section>
          <div className="flex items-baseline justify-between mb-3">
            <label htmlFor="count" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t.sandbox.countLabel}
            </label>
            <span className="text-2xl font-bold text-brand-600 dark:text-brand-400 tabular-nums">
              {count}
            </span>
          </div>
          <input
            id="count"
            type="range"
            min={1}
            max={max}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>1</span>
            <button
              type="button"
              onClick={() => setCount(max)}
              className="text-brand-700 dark:text-brand-400 font-medium hover:text-brand-800 dark:hover:text-brand-300"
            >
              {t.sandbox.allLabelTemplate.replace('{max}', max)}
            </button>
            <span>{max}</span>
          </div>
        </section>

        <section>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
            {t.sandbox.timerLabel}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {timerOptions.map((opt) => (
              <TimerOption
                key={String(opt.value)}
                label={opt.label}
                active={durationSeconds === opt.value}
                onClick={() => setDurationSeconds(opt.value)}
              />
            ))}
          </div>
        </section>
      </div>

      <footer className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart || starting}
          className="px-5 py-2.5 rounded-md bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/50 disabled:cursor-not-allowed text-white font-medium shadow-sm transition-colors cursor-pointer"
        >
          {starting ? t.sandbox.startingButton : t.sandbox.startButton}
        </button>
      </footer>
    </div>
  )
}

export default SandboxPanel
