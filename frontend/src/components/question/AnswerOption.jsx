// `multi` renders a square (checkbox-style) badge to signal that more than one
// answer can be selected; otherwise the badge is round (radio-style).
function AnswerOption({ label, letter, selected, onClick, multi = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
        selected
          ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-500 text-slate-900 dark:text-white'
          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 text-slate-900 dark:text-slate-100'
      }`}
    >
      <span
        className={`w-8 h-8 ${multi ? 'rounded-md' : 'rounded-full'} flex items-center justify-center font-semibold text-sm shrink-0 transition-colors ${
          selected
            ? 'bg-brand-600 text-white'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
        }`}
      >
        {multi && selected ? '✓' : letter}
      </span>
      <span className="flex-1">{label}</span>
    </button>
  )
}

export default AnswerOption
