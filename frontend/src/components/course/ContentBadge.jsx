// Badge showing if a course has questions. Used in course cards.
function ContentBadge({ hasContent }) {
  if (hasContent) {
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
        Έχει ερωτήσεις
      </span>
    )
  }
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded">
      Άδειο
    </span>
  )
}

export default ContentBadge
