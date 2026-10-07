// Icon-only toggle (favorite / passed) with a hover tooltip. Plain icon: outlined when off,
// filled when on, with a short colour fade. Shared by CourseCard and CourseStart.

const TONES = {
  red: { hover: 'hover:text-red-500', on: 'text-red-500 fill-red-500' },
  brand: { hover: 'hover:text-brand-600 dark:hover:text-brand-400', on: 'text-brand-600 dark:text-brand-400 fill-brand-600/15' },
}

function CourseToggleButton({ icon: Icon, active, pending = false, onClick, label, tone = 'red', size = 'md' }) {
  const c = TONES[tone]
  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-[18px] h-[18px]'

  return (
    <span className="relative inline-flex self-center group/toggle">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-label={label}
        aria-pressed={active}
        aria-busy={pending}
        className={`p-1.5 rounded-md cursor-pointer disabled:cursor-wait hover:bg-slate-100 dark:hover:bg-slate-800
          transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 ${
            active ? '' : `text-slate-400 dark:text-slate-500 ${c.hover}`
          }`}
      >
        <Icon
          strokeWidth={2}
          className={`${iconSize} transition-[fill,color,opacity] duration-200 ${active ? c.on : 'fill-transparent'} ${
            pending ? 'opacity-50' : ''
          }`}
        />
      </button>

      <span
        role="tooltip"
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-full mt-1 z-20 whitespace-nowrap rounded bg-slate-800 dark:bg-slate-700 px-2 py-1 text-xs text-white
          opacity-0 transition-opacity duration-100 group-hover/toggle:opacity-100 group-hover/toggle:delay-500 group-focus-within/toggle:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}

export default CourseToggleButton
