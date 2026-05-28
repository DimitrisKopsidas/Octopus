function ModeCard({ emoji, title, description, bullets }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{description}</p>
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 mt-auto">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-brand-600 dark:text-brand-400 mt-0.5 shrink-0">✓</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ModeCard
