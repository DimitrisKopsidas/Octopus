// Single True/False option card. Used by TrueFalseAnswers.
function TrueFalseCard({ label, emoji, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 p-5 text-center transition-all ${
        selected
          ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 ring-1 ring-emerald-200 dark:ring-emerald-900 shadow-sm'
          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <span className={`text-2xl block mb-1 ${selected ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
        {emoji}
      </span>
      <span className={`text-sm font-semibold ${selected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
        {label}
      </span>
    </button>
  )
}

export default TrueFalseCard
