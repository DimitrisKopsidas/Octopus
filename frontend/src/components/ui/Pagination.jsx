// Reusable paginated nav: numbered pages (with ellipsis) + prev/next. Used by StudyMaterialPanel.

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

// Page list that stays compact past 5 pages by collapsing the middle into "…":
//   1 2 3 … 10   ·   1 … 4 5 6 … 10   ·   1 … 8 9 10
// (siblings = 1 page on each side of the current page)
function pageWindow(current, total, siblings = 1) {
  if (total <= 5) return range(1, total)

  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, total)
  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < total - 1
  const edgeCount = siblings * 2 + 1 // pages shown when one side hugs an edge

  if (!showLeftDots && showRightDots) return [...range(1, edgeCount), 'gap-right', total]
  if (showLeftDots && !showRightDots) return [1, 'gap-left', ...range(total - edgeCount + 1, total)]
  return [1, 'gap-left', ...range(leftSibling, rightSibling), 'gap-right', total]
}

function Pagination({ page, totalPages, onChange, prevLabel, nextLabel, pageTemplate }) {
  if (totalPages <= 1) return null

  return (
    <nav className="mt-6 flex items-center justify-between gap-2" aria-label="pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {prevLabel}
      </button>

      <div className="hidden sm:flex items-center gap-1">
        {pageWindow(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={`w-9 h-9 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
                item === page
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="w-7 text-center text-slate-400 dark:text-slate-600">…</span>
          )
        )}
      </div>

      <span className="sm:hidden text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
        {pageTemplate.replace('{current}', page).replace('{total}', totalPages)}
      </span>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {nextLabel}
      </button>
    </nav>
  )
}

export default Pagination
