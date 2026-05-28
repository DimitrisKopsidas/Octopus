import t from '../../content/test.json'

function QuestionNavigator({ questions, currentIndex, answers, flaggedIds, onJump }) {
  return (
    <div className="mb-6 max-h-28 overflow-y-auto flex flex-wrap gap-1.5">
      {questions.map((q, i) => {
        const isCurrent = i === currentIndex
        const isAnswered = answers[q.id] != null
        const isFlagged = flaggedIds.has(q.id)
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onJump(i)}
            aria-label={t.navigatorJumpTemplate.replace('{n}', i + 1)}
            aria-current={isCurrent ? 'true' : undefined}
            className={`relative w-8 h-8 rounded-full text-xs font-semibold transition-all ${
              isCurrent
                ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-300 dark:ring-brand-700'
                : isAnswered
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600'
            } ${isFlagged ? 'ring-2 ring-amber-400 dark:ring-amber-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950' : ''}`}
          >
            {i + 1}
          </button>
        )
      })}
    </div>
  )
}

export default QuestionNavigator
