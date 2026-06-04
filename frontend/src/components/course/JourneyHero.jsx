// Hero band with the 3-step journey cards that act as tabs. Used by CourseStart.
import t from '../../content/courseStart.json'

const JOURNEY_STEPS = ['study', 'systematic', 'sandbox']

// Hero band introducing the 3-step learning journey. The step cards double as
// the tab switcher: Study → Systematic → Practice.
function JourneyHero({ activeTab, onSelect }) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/30 dark:to-slate-900 p-6 sm:p-8">
      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400 bg-brand-100/70 dark:bg-brand-900/40 px-2.5 py-1 rounded-full">
        {t.hero.badge}
      </span>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
        {t.hero.subtitle}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {JOURNEY_STEPS.map((key, i) => {
          const active = activeTab === key
          const step = t.hero.steps[i]
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-current={active ? 'step' : undefined}
              className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                active
                  ? 'border-brand-500 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-brand-200 dark:ring-brand-800'
                  : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 hover:border-brand-300 dark:hover:border-brand-700'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    active
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`text-sm font-semibold ${active ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {step.title}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug pl-[2.375rem]">
                {step.desc}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default JourneyHero
