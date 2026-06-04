// Timer countdown display. Used by Test.
function Countdown({ seconds }) {
  const safe = Math.max(0, seconds)
  const m = Math.floor(safe / 60)
  const s = safe % 60
  const low = safe <= 60 && safe > 0
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold tabular-nums ${
        low
          ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
      }`}
    >
      <span aria-hidden="true">⏱</span>
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  )
}

export default Countdown
