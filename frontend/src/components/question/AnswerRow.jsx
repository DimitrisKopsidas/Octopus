// Editable answer row (input + correct toggle + remove). Used by MultipleChoiceAnswers.
function AnswerRow({ index, value, isCorrect, canRemove, onChange, onToggleCorrect, onRemove }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border transition-all ${
        isCorrect
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-200 dark:ring-emerald-900'
          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700'
      } pl-3 pr-2 py-2`}
    >
      <button
        type="button"
        onClick={onToggleCorrect}
        aria-label="Σημείωσε ως σωστή"
        aria-pressed={isCorrect}
        className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
          isCorrect
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-600'
        }`}
      >
        {isCorrect && <span className="text-xs leading-none">✓</span>}
      </button>
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-5 shrink-0">
        {index + 1}.
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Απάντηση ${index + 1}`}
        className="flex-1 bg-transparent px-1 py-1 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label="Αφαίρεση απάντησης"
        className="shrink-0 w-8 h-8 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="text-lg leading-none">×</span>
      </button>
    </div>
  )
}

export default AnswerRow
