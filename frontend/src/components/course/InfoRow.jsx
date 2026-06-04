// Label/value row. Used by CourseInfoCard.
function InfoRow({ label, children, muted }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={`text-xs uppercase tracking-wider font-medium ${muted ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  )
}

export default InfoRow
