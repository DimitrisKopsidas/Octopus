// Loading skeleton for the CourseStart page.
import Skeleton from '../ui/Skeleton'
import t from '../../content/courseStart.json'

function CourseStartSkeleton() {
  return (
    <div
      role="status"
      aria-label={t.loading}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
    >
      <div className="md:col-span-2 space-y-6">
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <Skeleton className="h-20 w-full rounded-lg" />
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-8 w-full mt-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-3">
          <Skeleton className="h-4 w-1/2 mb-3" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-3">
          <Skeleton className="h-4 w-2/3 mb-3" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default CourseStartSkeleton
