// Primitive: animated grey box. Compose into layout-matching skeletons.
function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`}
    />
  )
}

export default Skeleton
