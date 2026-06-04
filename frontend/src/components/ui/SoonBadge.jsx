// Coming-soon badge. Used in Info / Home.
import t from '../../content/courseStart.json'

function SoonBadge() {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
      {t.info.soonBadge}
    </span>
  )
}

export default SoonBadge
