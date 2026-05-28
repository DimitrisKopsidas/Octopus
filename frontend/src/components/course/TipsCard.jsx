import t from '../../content/courseStart.json'

function TipsCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <header className="px-5 py-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          {t.tipsCard.title}
        </h2>
      </header>
      <ol className="px-5 py-4 space-y-3">
        {t.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className="shrink-0 w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{tip}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default TipsCard
